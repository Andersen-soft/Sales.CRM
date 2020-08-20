package com.andersenlab.crm.rest.facade;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.events.MailExpressSaleCreatedEvent;
import com.andersenlab.crm.events.MailImportSaleActivityCreatedEvent;
import com.andersenlab.crm.exceptions.CrmException;
import com.andersenlab.crm.exceptions.ExceptionMessages;
import com.andersenlab.crm.exceptions.ResourceNotFoundException;
import com.andersenlab.crm.model.EventType;
import com.andersenlab.crm.model.Sex;
import com.andersenlab.crm.model.entities.Activity;
import com.andersenlab.crm.model.entities.ActivityType;
import com.andersenlab.crm.model.entities.Company;
import com.andersenlab.crm.model.entities.CompanySale;
import com.andersenlab.crm.model.entities.CompanySaleGoogleAdRecord;
import com.andersenlab.crm.model.entities.Contact;
import com.andersenlab.crm.model.entities.Country;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.model.entities.QCompanySale;
import com.andersenlab.crm.model.entities.Source;
import com.andersenlab.crm.repositories.ContactRepository;
import com.andersenlab.crm.repositories.EmployeeRepository;
import com.andersenlab.crm.repositories.SourceRepository;
import com.andersenlab.crm.rest.dto.MailImportSaleRequest;
import com.andersenlab.crm.rest.dto.MailImportSaleResponse;
import com.andersenlab.crm.rest.request.CompanySaleCreateRequest;
import com.andersenlab.crm.rest.request.CompanySaleUpdateRequest;
import com.andersenlab.crm.rest.request.ExpressSaleCreateRequest;
import com.andersenlab.crm.rest.request.SiteCreateDto;
import com.andersenlab.crm.rest.response.CompanySaleResponse;
import com.andersenlab.crm.rest.response.ExpressSaleDto;
import com.andersenlab.crm.rest.response.ExpressSaleResponse;
import com.andersenlab.crm.security.AuthenticatedUser;
import com.andersenlab.crm.services.ActivityService;
import com.andersenlab.crm.services.CompanySaleGoogleAdRecordService;
import com.andersenlab.crm.services.CompanySaleServiceNew;
import com.andersenlab.crm.services.CompanyService;
import com.andersenlab.crm.services.ContactService;
import com.andersenlab.crm.services.CountryService;
import com.andersenlab.crm.services.EmployeeService;
import com.andersenlab.crm.services.MailImportSaleHistoryService;
import com.andersenlab.crm.utils.CrmStringUtils;
import com.andersenlab.crm.utils.ServiceUtils;
import com.querydsl.core.types.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.validator.routines.EmailValidator;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.validation.ValidationException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

import static com.andersenlab.crm.model.EventType.CREATE;
import static com.andersenlab.crm.model.RoleEnum.ROLE_SALES;
import static com.andersenlab.crm.model.RoleEnum.ROLE_SALES_ASSISTANT;
import static com.andersenlab.crm.model.entities.CompanySale.Status.ARCHIVE;
import static com.andersenlab.crm.model.entities.MailImportSaleHistory.MailImportSaleResult.EMPLOYEE_NOT_FOUND;
import static com.andersenlab.crm.model.entities.MailImportSaleHistory.MailImportSaleResult.EMPLOYEE_NOT_SALES;
import static com.andersenlab.crm.model.entities.MailImportSaleHistory.MailImportSaleResult.NO_CONTACT_EMAIL;
import static com.andersenlab.crm.model.entities.MailImportSaleHistory.MailImportSaleResult.SUCCESS_ACTIVITY;
import static com.andersenlab.crm.model.entities.MailImportSaleHistory.MailImportSaleResult.SUCCESS_SALE;
import static com.andersenlab.crm.utils.CrmConstants.CRM_BOT_LOGIN;
import static com.andersenlab.crm.utils.CrmConstants.SOURCE_NAME_EMAIL;
import static com.andersenlab.crm.utils.CrmConstants.SOURCE_NAME_REFERENCE;
import static com.andersenlab.crm.utils.CrmConstants.SOURCE_NAME_SITE;
import static com.andersenlab.crm.utils.CrmStringUtils.fixStringDescription;
import static com.andersenlab.crm.utils.ServiceUtils.employeeRolesContains;
import static com.andersenlab.crm.utils.ServiceUtils.not;
import static java.lang.Boolean.FALSE;
import static java.lang.Boolean.TRUE;

@Service
@Slf4j
@RequiredArgsConstructor
public class CompanySaleFacadeImpl implements CompanySaleFacade {
    private static final String COMMENT_NULL_MESSAGE = "Пользователь не оставил сообщения";
    private static final String EXCEPTION_NO_EMAIL_NOR_PHONE = "Email or phone fields must be filled in";
    private static final String EXCEPTION_NO_CONTACT_EMAIL_MESSAGE = "No contact email has been specified";

    private final CompanySaleServiceNew companySaleServiceNew;
    private final CompanySaleGoogleAdRecordService googleAdRecordService;
    private final ActivityService activityService;
    private final CompanyService companyService;
    private final ContactService contactService;
    private final ContactRepository contactRepository;
    private final CountryService countryService;
    private final EmployeeService employeeService;
    private final MailImportSaleHistoryService mailImportSaleHistoryService;
    private final SourceRepository sourceRepository;
    private final ConversionService conversionService;
    private final EmployeeRepository employeeRepository;
    private final AuthenticatedUser authenticatedUser;
    private final ApplicationEventPublisher eventPublisher;
    private final EmailValidator emailValidator;

    @Override
    public Page<CompanySaleResponse> getCompanySales(Predicate predicate, Pageable pageable) {
        pageable = fixOrdersStr(pageable);
        Page<CompanySale> companySales = companySaleServiceNew.getCompanySales(predicate, pageable);
        return conversionService.convertToPage(pageable, companySales, CompanySaleResponse.class);
    }

    @Override
    public List<String> getCategories() {
        return Stream.of(CompanySale.Category.values())
                .map(Enum::name)
                .collect(Collectors.toList());
    }

    private Pageable fixOrdersStr(Pageable pageable) {
        if (pageable.getSort() == null) {
            return pageable;
        }
        Stream<Sort.Order> orderStream = StreamSupport.stream(pageable.getSort().spliterator(), false);
        List<Sort.Order> orderList = orderStream
                .map(order -> {
                    if (order.getProperty().equals(
                            QCompanySale.companySale.lastActivity.getMetadata().getName()
                                    .concat(".")
                                    .concat(QCompanySale.companySale.lastActivity.dateActivity.getMetadata().getName()))
                            ) {
                        return defineNewOrder(order, Sort.NullHandling.NULLS_FIRST);
                    } else {
                        return order;
                    }
                })
                .collect(Collectors.toList());
        pageable = new PageRequest(pageable.getPageNumber(), pageable.getPageSize(), new Sort(orderList));
        return pageable;
    }

    @Override
    public Long createCompanySale(CompanySaleCreateRequest request) {
        CompanySale companySale = new CompanySale();
        companySale.setResponsible(authenticatedUser.getCurrentEmployee());
        companySale.setStatus(CompanySale.Status.LEAD);
        companySale.setStatusChangedDate(LocalDateTime.now());
        companySale.setNextActivityDate(LocalDateTime.now());
        companySale.setSource(sourceRepository.getOne(request.getSourceId()));

        if (SOURCE_NAME_REFERENCE.equalsIgnoreCase(companySale.getSource().getNameEn())
                && request.getRecommendationId() != null
                && request.getRecommendationId() != -1L
        ) {
            companySale.setRecommendedBy(companyService.findById(request.getRecommendationId()));
        }

        companySale.setWeight(-1L);

        Company company = companyService.findCompanyByName(request.getCompany().getName());
        if (company == null) {
            company = companyService.createCompany(request.getCompany());
        }
        companySale.setCompany(company);

        if (request.getCompany().getContactId() != null) {
            Contact contact = contactService.getContactById(request.getCompany().getContactId());
            companySale.setMainContact(contact);
        } else {
            request.getCompany().getContact().setCompanyId(companySale.getCompany().getId());
            request.getCompany().getContact().setSourceId(request.getSourceId());
            Long id = contactService.createContact(request.getCompany().getContact());
            companySale.setMainContact(new Contact(id));
        }

        CompanySale persisted = companySaleServiceNew.createSale(companySale);
        return persisted.getId();
    }

    @Override
    public void updateCompanySale(long id, CompanySaleUpdateRequest request) {
        CompanySale updatedSale = new CompanySale();
        Optional.ofNullable(request.getResponsibleId())
                .ifPresent(responsibleId -> updatedSale.setResponsible(employeeRepository.findById(responsibleId)));
        Optional.ofNullable(request.getMainContactId())
                .ifPresent(mainContactId -> updatedSale.setMainContact(contactService.getContactById(mainContactId)));
        Optional.ofNullable(request.getSourceId())
                .ifPresent(sourceId -> updatedSale.setSource(sourceRepository.getOne(sourceId)));
        Optional.ofNullable(request.getDescription())
                .ifPresent(description -> updatedSale.setDescription(fixStringDescription(description)));
        Optional.ofNullable(request.getStatus())
                .ifPresent(status -> updatedSale.setStatus(CompanySale.Status.valueOf(status)));
        Optional.ofNullable(request.getCategory())
                .ifPresent(category -> updatedSale.setCategory(CompanySale.Category.valueOf(category)));
        Optional.ofNullable(request.getRecommendationId())
                .ifPresent(recommendation -> {
                    if (recommendation != -1L) {
                        updatedSale.setRecommendedBy(companyService.findCompanyByIdOrThrowException(recommendation));
                    } else {
                        Company flagToRemoveRecommendation = new Company();
                        flagToRemoveRecommendation.setId(recommendation);
                        updatedSale.setRecommendedBy(flagToRemoveRecommendation);
                    }
                });
        Optional.ofNullable(request.getCompanyId())
                .ifPresent(companyId -> updatedSale.setCompany(companyService.findCompanyByIdOrThrowException(companyId)));
        Optional.ofNullable(request.getNextActivityDate())
                .ifPresent(updatedSale::setNextActivityDate);
        Optional.ofNullable(request.getWeight())
                .ifPresent(updatedSale::setWeight);

        companySaleServiceNew.updateSaleById(id, updatedSale);
    }

    @Override
    public Long importCompanySaleFromSite(SiteCreateDto request) {
        log.info("IMPORT SALE: Received import sale request from site: {}", request);
        validateFormField(request.getForm());

        String phone = request.getPhone();
        String mail = request.getEmail();
        String comment = null;
        String form = request.getForm();

        if (mail != null && !emailValidator.isValid(mail)) {
            log.info("IMPORT SALE: Invalid mail: {}", mail);
            comment = "EMAIL: " + mail;
            request.setEmail(null);
        }

        if (phone != null && !phone.matches("[+()\\s\\-0-9]+")) {
            log.info("IMPORT SALE: Invalid phone: {}", phone);
            comment = "PHONE: " + phone;
            request.setPhone(null);
        }
        if (request.getEmail() != null || request.getPhone() != null) {
            String message = checkMessage(request.getMessage(), request.getContent(), form);
            LocalDateTime siteDate = checkAndFormatDateFromSite(request.getDate());
            List<CompanySale> previousSales = companySaleServiceNew.findPreviousCompanySalesByContactEmailOrPhone(
                    siteDate, request.getEmail(), request.getPhone());

            if (previousSales.isEmpty()) {
                CompanySale companySale = new CompanySale();
                // crm bot
                companySale.setResponsible(employeeRepository.findEmployeeByLogin(CRM_BOT_LOGIN));
                companySale.setStatus(CompanySale.Status.LEAD);
                companySale.setCreateDate(siteDate);
                companySale.setNextActivityDate(LocalDateTime.now().plusDays(1));

                Company company = findOrCreateCompanyByContactEmailOrPhone(
                        request.getEmail(), request.getPhone());

                Country country = countryService.defineByIp(request.getIp());
                Source siteSource = sourceRepository.findSourceByNameEqualsIgnoreCase(SOURCE_NAME_SITE);
                Contact contact = findOrCreateContactByCompanyAndEmailOrPhone(
                        company, country, request.getName(), request.getEmail(), request.getPhone());

                companySale.setCompany(company);
                companySale.setMainContact(contact);
                companySale.setSource(siteSource);

                Optional.ofNullable(request.getEmail())
                        .ifPresent(e -> validateEmailField(e, companySale));

                Optional.ofNullable(comment).ifPresent(companySale::setDescription);

                CompanySale persistedSale = companySaleServiceNew.createSale(companySale);
                createActivityForSaleWithDescription(persistedSale, message, siteDate);
                createGoogleAdRecordForSale(request, companySale);

                log.info("IMPORT SALE: Created sale {} with responsible {} for company {} and main contact {}",
                        persistedSale.getId(),
                        persistedSale.getResponsible().getId(),
                        persistedSale.getCompany().getId(),
                        persistedSale.getMainContact().getId());
                return persistedSale.getId();
            } else {
                log.info("IMPORT SALE: Found old sales {}. Creating new activities for specified sales.",
                        previousSales.stream().map(CompanySale::getId).collect(Collectors.toList()));
                previousSales.forEach(sale -> createActivityForSaleWithDescription(sale, message, LocalDateTime.now()));
                if (comment != null) {
                    String finalComment = comment;
                    previousSales.forEach(sale -> {
                        sale.setDescription(addTextToMessage(sale.getDescription(), finalComment));
                        companySaleServiceNew.updateSaleById(sale.getId(), sale);
                    });
                }
                return null;
            }
        } else {
            throw new CrmException(EXCEPTION_NO_EMAIL_NOR_PHONE);
        }
    }


    @Override
    public ExpressSaleResponse createExpressSale(ExpressSaleCreateRequest request) {
        Source siteSource = sourceRepository.findSourceByNameEqualsIgnoreCase(SOURCE_NAME_SITE);
        Employee employee = employeeRepository.findEmployeeByLogin(CRM_BOT_LOGIN);
        return createExpressSale(request, employee, siteSource);
    }

    @Override
    public ExpressSaleResponse createExpressSaleByMail(ExpressSaleCreateRequest request) {
        Long id = Optional.ofNullable(request.getResponsibleId())
                .orElseThrow(() -> new ValidationException("Responsible can't be null"));
        Employee responsible = employeeRepository.findById(id);
        Source mailSource = sourceRepository.findSourceByNameEqualsIgnoreCase(SOURCE_NAME_EMAIL);
        return createExpressSale(request, responsible, mailSource);
    }


    private ExpressSaleResponse createExpressSale(ExpressSaleCreateRequest request, Employee responsible, Source source) {
        if (request.getMail() != null || request.getPhone() != null) {
            LocalDateTime currentTime = LocalDateTime.now();
            List<CompanySale> previousSales = companySaleServiceNew.findPreviousCompanySalesByContactEmailOrPhone(
                    currentTime, request.getMail(), request.getPhone());

            ExpressSaleResponse response = new ExpressSaleResponse();

            if (previousSales.isEmpty()) {
                CompanySale companySale = new CompanySale();
                companySale.setResponsible(responsible);
                companySale.setStatus(CompanySale.Status.LEAD);
                companySale.setCreateDate(currentTime);
                companySale.setNextActivityDate(LocalDateTime.now().plusDays(1));

                Company company = findOrCreateCompanyByContactEmailOrPhone(
                        request.getMail(), request.getPhone());

                Country country = Optional.ofNullable(request.getCountryId())
                        .map(countryService::findById).orElse(null);
                Contact contact = findOrCreateContactByCompanyAndEmailOrPhone(
                        company, country, request.getName(), request.getMail(), request.getPhone());

                companySale.setCompany(company);
                companySale.setMainContact(contact);
                companySale.setSource(source);

                CompanySale persistedSale = companySaleServiceNew.createSale(companySale);
                createActivityForSaleWithDescription(persistedSale, request.getDescription(), currentTime);
                if (notBot(responsible)) {
                    eventPublisher.publishEvent(MailExpressSaleCreatedEvent.builder()
                            .companySale(persistedSale).build());
                }

                ExpressSaleDto dto = new ExpressSaleDto();
                dto.setId(persistedSale.getId());
                dto.setCompanyName(persistedSale.getCompany().getName());

                response.setSales(Collections.singletonList(dto));
                response.setType(EventType.CREATE);
            } else {
                CompanySale firstSale = previousSales.stream()
                        .findFirst()
                        .orElseThrow(() -> new CrmException("Something went wrong..."));
                if (notBot(responsible)) {
                    eventPublisher.publishEvent(MailImportSaleActivityCreatedEvent.builder()
                            .companySale(firstSale)
                            .specifiedResponsible(responsible)
                            .build());
                }

                previousSales.forEach(sale -> createActivityForSaleWithDescription(sale, request.getDescription(), currentTime));
                response.setSales(previousSales.stream()
                        .map(s -> {
                            ExpressSaleDto dto = new ExpressSaleDto();
                            dto.setId(s.getId());
                            dto.setCompanyName(s.getCompany().getName());

                            return dto;
                        }).collect(Collectors.toList()));
                response.setType(EventType.UPDATE);
            }

            return response;
        } else {
            throw new CrmException(EXCEPTION_NO_EMAIL_NOR_PHONE);
        }
    }

    private boolean notBot(Employee employee) {
        return !CRM_BOT_LOGIN.equals(employee.getLogin());
    }

    @Override
    public MailImportSaleResponse importCompanySaleFromMail(MailImportSaleRequest request) {
        ExpressSaleCreateRequest serviceRequest = new ExpressSaleCreateRequest();
        List<String> requestEmails = Arrays.asList(
                request.getSender().split("[,;]\\s+"));

        requestEmails = removeRegisteredEmails(requestEmails);
        if (requestEmails.isEmpty()) {
            mailImportSaleHistoryService.createFromRequest(request, null, NO_CONTACT_EMAIL);
            throw new CrmException(EXCEPTION_NO_CONTACT_EMAIL_MESSAGE);
        }

        String mainContactEmail = requestEmails.get(0);
        serviceRequest.setMail(mainContactEmail);
        String actualDescription = Optional.ofNullable(request.getBody())
                .map(body -> body.replace("\\n", "\n"))
                .orElse(COMMENT_NULL_MESSAGE);
        serviceRequest.setDescription(actualDescription);

        Employee responsible = employeeService.findByEmail(request.getReceiver());

        if (responsible == null || FALSE.equals(responsible.getIsActive())) {
            mailImportSaleHistoryService.createFromRequest(request, null, EMPLOYEE_NOT_FOUND);
            throw new ResourceNotFoundException(ExceptionMessages.EMPLOYEE_NOT_FOUND_MESSAGE);
        }
        if (employeeRolesContains(responsible, ROLE_SALES_ASSISTANT)) {
            responsible = responsible.getMentor();
        }
        if (!employeeRolesContains(responsible, ROLE_SALES)) {
            mailImportSaleHistoryService.createFromRequest(request, null, EMPLOYEE_NOT_SALES);
            throw new CrmException("You can only import mail sale for sales employee");
        }

        serviceRequest.setResponsibleId(responsible.getId());
        ExpressSaleResponse response = createExpressSaleByMail(serviceRequest);

        Long saleId = response.getSales()
                .stream()
                .findFirst()
                .map(ExpressSaleDto::getId)
                .orElse(null);

        CompanySale resultSale = Optional.ofNullable(saleId)
                .map(companySaleServiceNew::findById)
                .orElse(null);
        if (CREATE.equals(response.getType())) {
            mailImportSaleHistoryService.createFromRequest(request, resultSale, SUCCESS_SALE);
            requestEmails.remove(mainContactEmail);
            if (!requestEmails.isEmpty()) {
                requestEmails.forEach(email -> findOrCreateContactByCompanyAndEmailOrPhone(
                        resultSale.getCompany(), null, null, email, null));
            }
        } else {
            mailImportSaleHistoryService.createFromRequest(request, resultSale, SUCCESS_ACTIVITY);
        }

        return MailImportSaleResponse.builder()
                .saleId(saleId)
                .build();
    }

    private List<String> removeRegisteredEmails(List<String> emails) {
        List<Employee> registeredEmployees = employeeRepository.findAll();
        Set<String> registeredEmails = new HashSet<>();
        registeredEmployees.forEach(employee -> {
            registeredEmails.add(employee.getEmail());
            registeredEmails.addAll(employee.getAdditionalEmails());
        });

        return emails.stream()
                .filter(not(registeredEmails::contains))
                .collect(Collectors.toList());
    }

    private Sort.Order defineNewOrder(Sort.Order order, Sort.NullHandling nullHandling) {
        return new Sort.Order(order.getDirection(), order.getProperty(), nullHandling);
    }

    /**
     * Validate form field of new order from site Andersen
     *
     * @param form field in siteRequest DTO
     */
    private void validateFormField(String form) {
        List<String> formBody = Arrays.asList(
                "mpTemplate",
                "defaultTemplate",
                "findDeveloper",
                "priceTemplate",
                "checkYourSite",
                "priceUiTemplate",
                "priceAWSTemplate",
                "priceSupportTemplate",
                "priceQATemplate"
        );
        if (!formBody.contains(form)) {
            throw new CrmException("Form field data is not valid");
        }
    }

    /**
     * Validate form field of new order from site Andersen
     *
     * @param email field in siteRequest DTO
     */
    private void validateEmailField(String email, CompanySale sale) {
        List<String> testEmails = Arrays.asList("qaands@gmail.com", "devandersenlab@gmail.com", "qaands+1@gmail.com", "qaands+2@gmail.com", "qaands+3@gmail.com");
        List<String> emailDomainsForArchive = Arrays.asList("@mail.ru", "@inbox.ru", "@list.ru", "@andersenlab.com", "@gmx.de", "@web.de", "@aol.com", "@freenet.de", "@mailinator.com");
        List<String> commonEmailDomainsForArchive = Arrays.asList("@gmail", "@hotmail", "@yahoo", "@yandex");

        if (testEmails.contains(email)) {
            throw new CrmException("Email field data is not valid");
        }

        Stream.concat(emailDomainsForArchive.stream(), commonEmailDomainsForArchive.stream())
                .forEach(e -> {
                    if (email.contains(e)) {
                        log.info("IMPORT SALE: Found domain for archive by specified email {}", email);
                        sale.setStatus(ARCHIVE);
                    }
                });
    }

    private LocalDateTime checkAndFormatDateFromSite(String date) {
        LocalDateTime siteTime;
        if (date == null) {
            siteTime = LocalDateTime.now();
        } else {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            siteTime = LocalDateTime.parse(date, formatter)
                    // Note: this should be fixed after server time migrates to UTC+0 timezone.
                    // Hardcoded 3 hours -- since server timezone is UTC+3, and hibernate will always subtract 3 hours
                    // from specified time, which is always received in UTC+0 timezone.
                    .plusHours(3);
        }
        return siteTime;
    }

    private Company findOrCreateCompanyByContactEmailOrPhone(String email, String phone) {
        Company company = new Company();
        if (email != null) {
            company.setName(email);
        } else {
            company.setName(phone);
        }

        Company specifiedCompany = companyService.findCompanyByName(company.getName());
        if (specifiedCompany != null && TRUE.equals(specifiedCompany.getIsActive())) {
            companyService.checkForDD(specifiedCompany);
            return specifiedCompany;
        } else {
            return companyService.createCompany(company);
        }
    }

    private Contact findOrCreateContactByCompanyAndEmailOrPhone(
            Company company, Country country, String name, String email, String phone) {
        List<Contact> specifiedContacts = contactRepository.findAllByCompanyId(company.getId());
        if (specifiedContacts.size() == 1) {
            Contact perspectiveContact = specifiedContacts.get(0);
            boolean sameEmailOrPhone = (perspectiveContact.getEmail() != null && perspectiveContact.getEmail().equalsIgnoreCase(email))
                    || (perspectiveContact.getPhone() != null && perspectiveContact.getPhone().equalsIgnoreCase(phone));
            if (TRUE.equals(perspectiveContact.getIsActive()) && sameEmailOrPhone) {
                return perspectiveContact;
            }
        }

        Contact contact = new Contact();
        if (name != null) {
            if (ServiceUtils.countWordsUsingStringTokenizer(name) > 1) {
                contact.setFirstName(name.substring(0, name.lastIndexOf(' ')));
                contact.setLastName(name.substring(name.lastIndexOf(' ') + 1));
            } else {
                contact.setFirstName(name);
            }
        } else {
            if (email != null) {
                contact.setFirstName(
                        email.substring(0, email.lastIndexOf('@')));
            } else {
                contact.setFirstName(phone);
            }
        }

        contact.setEmail(email);
        contact.setPhone(phone);
        contact.setCountry(country);
        contact.setCompany(company);
        contact.setSex(Sex.MALE);

        return contactService.createContact(contact);
    }

    private void createActivityForSaleWithDescription(CompanySale companySale, String content, LocalDateTime activityTime) {
        Activity activity = new Activity();
        activity.setIsActive(true);
        activity.setDateActivity(activityTime);
        activity.setCompanySale(companySale);
        activity.setResponsible(companySale.getResponsible());
        activity.setDescription(Optional.ofNullable(content)
                .map(CrmStringUtils::fixStringDescription)
                .orElse(COMMENT_NULL_MESSAGE));
        activity.setContacts(Collections.singleton(companySale.getMainContact()));

        ActivityType mailType = ActivityType.builder()
                .activity(activity)
                .type(Activity.TypeEnum.EMAIL.toString())
                .build();
        activity.setActivityTypes(Collections.singleton(mailType));

        activityService.createActivity(activity);
    }

    private void createGoogleAdRecordForSale(SiteCreateDto request, CompanySale companySale) {
        if (request.getGoogleClickId() != null && !request.getGoogleClickId().isEmpty()) {
            CompanySaleGoogleAdRecord googleAdRecord = googleAdRecordService.buildByCompanySale(
                    companySale,
                    request.getGoogleClickId(),
                    request.getSiteFirstPoint(),
                    request.getSiteLastPoint(),
                    request.getSiteSessionPoint()
            );
            googleAdRecordService.create(googleAdRecord);
        }
    }

    private String addTextToMessage(String message, String text) {
        return message == null || message.isEmpty() ? text : message + "\n" + text;
    }

    private String checkMessage(String requestMessage, String content, String form) {
        String msg;
        if (form.contains("price")) {
            if (requestMessage == null || requestMessage.isEmpty()) {
                msg = COMMENT_NULL_MESSAGE;
                if (requestMessage == null || requestMessage.isEmpty() && content != null) {
                    msg = content;
                }
            } else {
                if (content != null && !content.isEmpty()) {
                    msg = requestMessage + "\n" + "\n" + content;
                } else {
                    msg = requestMessage;
                }
            }
        } else {
            msg = requestMessage;
        }
        return msg;
    }
}
