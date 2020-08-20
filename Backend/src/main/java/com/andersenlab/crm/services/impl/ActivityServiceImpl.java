package com.andersenlab.crm.services.impl;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.exceptions.CrmException;
import com.andersenlab.crm.exceptions.ResourceNotFoundException;
import com.andersenlab.crm.model.entities.Activity;
import com.andersenlab.crm.model.entities.ActivityReport;
import com.andersenlab.crm.model.entities.ActivityType;
import com.andersenlab.crm.model.entities.Company;
import com.andersenlab.crm.model.entities.CompanySale;
import com.andersenlab.crm.model.entities.Contact;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.model.entities.QActivity;
import com.andersenlab.crm.model.entities.QContact;
import com.andersenlab.crm.repositories.ActivityRepository;
import com.andersenlab.crm.repositories.ActivityTypeRepository;
import com.andersenlab.crm.repositories.CompanySaleRepository;
import com.andersenlab.crm.repositories.ContactRepository;
import com.andersenlab.crm.rest.request.ActivityCreateRequest;
import com.andersenlab.crm.rest.request.ActivityUpdateRequest;
import com.andersenlab.crm.rest.response.ActivityTypeResponse;
import com.andersenlab.crm.security.AuthenticatedUser;
import com.andersenlab.crm.services.ActivityService;
import com.andersenlab.crm.services.i18n.I18nService;
import com.querydsl.core.types.ConstantImpl;
import com.querydsl.core.types.ExpressionUtils;
import com.querydsl.core.types.Predicate;
import com.querydsl.core.types.dsl.BooleanOperation;
import com.querydsl.core.types.dsl.Expressions;
import lombok.AllArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.validation.ConstraintViolationException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Comparator;
import java.util.EnumSet;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import static com.andersenlab.crm.services.i18n.I18nConstants.LANGUAGE_TAG_EN;
import static com.andersenlab.crm.services.i18n.I18nConstants.LANGUAGE_TAG_RU;
import static com.andersenlab.crm.utils.CrmStringUtils.fixStringDescription;
import static com.andersenlab.crm.utils.PredicateHelper.emptyIfNull;

@Service
@AllArgsConstructor
public class ActivityServiceImpl implements ActivityService {

    private final ConversionService conversionService;
    private final ActivityRepository activityRepository;
    private final ActivityTypeRepository activityTypeRepository;
    private final AuthenticatedUser authenticatedUser;
    private final CompanySaleRepository saleRepository;
    private final ContactRepository contactRepository;
    private final I18nService i18n;

    @Override
    @Transactional
    public Long createActivity(ActivityCreateRequest request, Employee employee) {
        Activity activity = defineActivity(request, employee);
        CompanySale sale = getCompanySale(request.getCompanySaleId());

        validateContacts(sale.getCompany(), new ArrayList<>(activity.getContacts()));

        activity.setCompanySale(sale);
        Set<ActivityType> types = defineActivityTypes(request.getTypes(), activity);
        activity.setActivityTypes(types);

        try {
            activityRepository.saveAndFlush(activity);
        } catch (DataIntegrityViolationException e) {
            throw new CrmException(e.getMostSpecificCause().getMessage(), e);
        } catch (ConstraintViolationException e) {
            throw new CrmException(getConstraintViolationExceptionMessage(e).toString(), e);
        }
        saleRepository.saveAndFlush(refreshSaleActivities(sale, activity));

        return activity.getId();
    }

    @Override
    @Transactional
    public Long createActivity(Activity activity) {
        validateContacts(activity.getCompanySale().getCompany(), new ArrayList<>(activity.getContacts()));
        Activity persisted = activityRepository.saveAndFlush(activity);
        saleRepository.saveAndFlush(refreshSaleActivities(activity.getCompanySale(), activity));

        return persisted.getId();
    }

    @Override
    @Transactional
    public Long createActivity(ActivityCreateRequest request) {
        return createActivity(request, authenticatedUser.getCurrentEmployee());
    }

    @Override
    public CompanySale refreshSaleActivities(CompanySale sale, Activity currentActivity) {
        Activity firstActivity = sale.getFirstActivity();
        if (firstActivity == null) {
            sale.setFirstActivity(currentActivity);
        }
        Activity lastActivity = sale.getLastActivity();
        if (lastActivity == null) {
            sale.setLastActivity(currentActivity);
        }
        Optional.ofNullable(sale.getFirstActivity()).ifPresent(activity -> {
            if (activity.getDateActivity().isAfter(currentActivity.getDateActivity())) {
                sale.setFirstActivity(currentActivity);
            }
        });
        Optional.ofNullable(sale.getLastActivity()).ifPresent(activity -> {
            if (activity.getDateActivity().isBefore(currentActivity.getDateActivity())) {
                sale.setLastActivity(currentActivity);
            }
        });
        return sale;
    }

    private Activity defineActivity(ActivityCreateRequest request, Employee employee) {
        Activity activity = conversionService.convert(request, Activity.class);
        activity.setIsActive(true);
        activity.setResponsible(employee);
        return activity;
    }

    private Set<ActivityType> defineActivityTypes(List<String> types, Activity activity) {
        return types.stream()
                .filter(v -> getTypeNamesAsStringList().contains(v))
                .map(v -> ActivityType.builder().type(Activity.TypeEnum.valueOf(v).toString()).activity(activity).build())
                .collect(Collectors.toSet());
    }

    private void validateContacts(Company company, List<Contact> activityContacts) {
        List<Contact> companyContacts = contactRepository.findAllByCompanyId(company.getId());
        List<Long> errorsId = new ArrayList<>();
        activityContacts.forEach(ac -> {
            if (companyContacts.stream().noneMatch(c -> c.getId().equals(ac.getId()))) {
                errorsId.add(ac.getId());
            }
        });
        if (!errorsId.isEmpty()) {
            throw new CrmException("Company's contacts do not contains contacts which input: %s", errorsId.toString());
        }
    }

    private CompanySale getCompanySale(Long saleId) {
        return Optional.ofNullable(saleRepository.findOne(saleId))
                .orElseThrow(() -> new ResourceNotFoundException("Sale not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public Activity getActivityById(Long id) {
        return Optional.ofNullable(activityRepository.findOne(id))
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Activity> getActivitiesWithFilter(Predicate predicate, Pageable pageable) {
       return activityRepository.findAll(predicate, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Activity> getActivitiesWithSearch(String query, Predicate predicate, Pageable pageable) {
        if(query.isEmpty()) {
            return activityRepository.findAll(predicate, pageable);
        }

        List<Contact> contacts = findContactsByQueryAndActivityPredicate(query, predicate);
        Predicate activityTypeSearchPredicate = defineActivityTypePredicateByQuery(query);

        Predicate p = QActivity.activity.description.containsIgnoreCase(query)
                .or(emptyIfNull(QActivity.activity.responsible.firstName)
                        .concat(" ")
                        .concat(emptyIfNull(QActivity.activity.responsible.lastName))
                        .containsIgnoreCase(query))
                .or(QActivity.activity.contacts.any().in(contacts))
                .or(activityTypeSearchPredicate)
                .and(predicate);

        return activityRepository.findAll(p, pageable);
    }

    private List<Contact> findContactsByQueryAndActivityPredicate(String query, Predicate predicate) {
        CompanySale foundSale = ((BooleanOperation) predicate).getArgs().stream()
                .filter(expression -> expression instanceof ConstantImpl
                        && ((ConstantImpl) expression).getConstant() instanceof CompanySale)
                .map(v -> (CompanySale) ((ConstantImpl) v).getConstant())
                .findFirst().orElse(null);

        if (foundSale != null) {
            Predicate pc = emptyIfNull(QContact.contact.firstName)
                    .concat(" ")
                    .concat(emptyIfNull(QContact.contact.lastName))
                    .containsIgnoreCase(query)
                    .and(QContact.contact.company.companySales.any().id.eq(foundSale.getId()));
            return (List<Contact>) contactRepository.findAll(pc);
        } else {
            return new ArrayList<>();
        }
    }

    private Predicate defineActivityTypePredicateByQuery(String query) {
        // получаем список из строк а-ля 'CALL Звонок Call'
        List<String> activityTypeKeywordList = new ArrayList<>();
        Arrays.stream(Activity.TypeEnum.values())
                .forEach(typeEnum -> {
                    StringBuilder builder = new StringBuilder(typeEnum.name());
                    builder.append(" ");
                    builder.append(i18n.getLocalizedMessage(
                            typeEnum.getName(), Locale.forLanguageTag(LANGUAGE_TAG_RU)));
                    builder.append(" ");
                    builder.append(i18n.getLocalizedMessage(
                            typeEnum.getName(), Locale.forLanguageTag(LANGUAGE_TAG_EN)));

                    activityTypeKeywordList.add(builder.toString());
                });

        return ExpressionUtils.anyOf(
                activityTypeKeywordList.stream()
                        .map(keyWord ->
                                Expressions.stringPath("\'" + keyWord + "\'")
                                        .containsIgnoreCase(QActivity.activity.activityTypes.any().type)
                                        .and(Expressions.stringPath("\'" + keyWord + "\'")
                                                .containsIgnoreCase(query)))
                        .collect(Collectors.toList())
        );
    }

    @Override
    @Transactional
    public Long updateActivity(Long id, ActivityUpdateRequest request) {
        Activity activity = getActivityById(id);
        CompanySale sale = getCompanySale(activity.getCompanySale().getId());
        Activity updateActivity = updateActivityFields(activity, request);
        validateContacts(sale.getCompany(), new ArrayList<>(updateActivity.getContacts()));
        Optional.ofNullable(request.getTypes())
                .ifPresent(types -> {
                    Set<ActivityType> collect = defineActivityTypes(request.getTypes(), updateActivity);
                    updateActivity.getActivityTypes().removeIf(type -> !collect.contains(type));
                    updateActivity.getActivityTypes().addAll(collect);
                });
        activityRepository.saveAndFlush(updateActivity);
        refreshSaleActivities(sale);
        saleRepository.saveAndFlush(sale);
        return activity.getId();
    }

    private void refreshSaleActivities(CompanySale sale) {
        Optional.ofNullable(sale.getActivities()).ifPresent(activities -> {
           activities.sort(Comparator.comparing(Activity::getDateActivity));
           if (!activities.isEmpty()) {
               sale.setFirstActivity(activities.get(0));
               sale.setLastActivity(activities.get(activities.size() - 1));
           }
        });
    }

    private Activity updateActivityFields(Activity activity, ActivityUpdateRequest request) {
        Set<Contact> contacts = request.getContacts().stream()
                .map(Contact::new)
                .collect(Collectors.toSet());
        Optional.ofNullable(request.getDescription())
                .ifPresent(desc -> activity.setDescription(fixStringDescription(desc)));
        Optional.ofNullable(request.getContacts())
                .ifPresent(contact -> activity.setContacts(contacts));
        Optional.ofNullable(request.getDateActivity())
                .ifPresent(activity::setDateActivity);
        return activity;
    }

    @Override
    @Transactional
    public void deleteActivity(Long id) {
        Long saleId = getActivityById(id).getCompanySale().getId();
        activityRepository.delete(id);
        CompanySale sale = saleRepository.findOne(saleId);
        sale.setActivities(sale.getActivities()
                .stream()
                .filter(activity -> !Objects.equals(activity.getId(), id))
                .collect(Collectors.toList()));
        refreshSaleActivities(sale);
        saleRepository.saveAndFlush(sale);
    }

    @Override
    public Collection<ActivityTypeResponse> getTypeNames(Locale locale) {
        return EnumSet.allOf(Activity.TypeEnum.class).stream()
                .map(v -> ActivityTypeResponse.builder()
                        .ordinal(v.ordinal())
                        .type(i18n.getLocalizedMessage(v.getName(), locale))
                        .typeEnumCode(v.name())
                        .build())
                .collect(Collectors.toList());
    }

    private Collection<String> getTypeNamesAsStringList() {
        return EnumSet.allOf(Activity.TypeEnum.class).stream()
                .map(Activity.TypeEnum::toString)
                .collect(Collectors.toList());
    }

    @Override
    public List<ActivityReport> getReports(LocalDate from, LocalDate to) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        return activityRepository.getActivityReport(
                getFormattedUTCDateTime(LocalDateTime.of(from, LocalTime.MIN), formatter),
                getFormattedUTCDateTime(LocalDateTime.of(to, LocalTime.MAX), formatter)
        );
    }

    private String getFormattedUTCDateTime(LocalDateTime dateTime, DateTimeFormatter formatter){
        ZonedDateTime zonedFrom = ZonedDateTime.of(dateTime, ZoneId.systemDefault());
        ZonedDateTime utcZonedFrom = zonedFrom.withZoneSameInstant(ZoneId.of("UTC"));
        return formatter.format(utcZonedFrom);
    }

    private List<String> getConstraintViolationExceptionMessage(ConstraintViolationException e) {
        return e.getConstraintViolations().stream()
                .map(c -> String.format("%s value '%s' %s", c.getPropertyPath(), c.getInvalidValue(), c.getMessage()))
                .collect(Collectors.toList());
    }
}
