package com.andersenlab.crm.rest.facade;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.model.entities.Activity;
import com.andersenlab.crm.model.entities.ActivityType;
import com.andersenlab.crm.model.entities.Company;
import com.andersenlab.crm.model.entities.CompanySale;
import com.andersenlab.crm.model.entities.Contact;
import com.andersenlab.crm.model.entities.SocialNetworkAnswer;
import com.andersenlab.crm.model.entities.SocialNetworkContact;
import com.andersenlab.crm.model.view.SocialNetworkAnswerSalesHeadView;
import com.andersenlab.crm.rest.dto.SocialAnswerDtoForm;
import com.andersenlab.crm.rest.dto.SocialNetworkAnswerHeadDto;
import com.andersenlab.crm.rest.response.RatingNCReportResponse;
import com.andersenlab.crm.rest.response.RatingNCResponse;
import com.andersenlab.crm.rest.response.SocialAnswerDto;
import com.andersenlab.crm.security.AuthenticatedUser;
import com.andersenlab.crm.services.CompanyService;
import com.andersenlab.crm.services.CountryService;
import com.andersenlab.crm.services.SocialNetworkAnswerService;
import com.andersenlab.crm.services.SocialNetworkContactService;
import com.andersenlab.crm.utils.CrmLocalDateUtils;
import com.querydsl.core.types.Predicate;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SocialNetworkAnswerFacadeImpl implements SocialNetworkAnswerFacade {

    private final ConversionService conversionService;
    private final SocialNetworkAnswerService socialNetworkAnswerService;
    private final SocialNetworkContactService socialNetworkContactService;
    private final CountryService countryService;
    private final CompanyService companyService;
    private final AuthenticatedUser authenticatedUser;
    private final ModelMapper modelMapper;

    @Override
    public SocialAnswerDtoForm create(SocialAnswerDtoForm dto) {
        validateCreate(dto);
        SocialNetworkAnswer entity = conversionService.convert(dto, SocialNetworkAnswer.class);
        SocialNetworkContact socialContact = socialNetworkContactService.getById(dto.getSocialNetworkContactId());
        if (socialContact != null) {
            Optional.ofNullable(socialContact.getSource()).ifPresent(entity::setSource);
        }
        entity.setAssistant(authenticatedUser.getCurrentEmployee());
        return conversionService.convert(socialNetworkAnswerService.create(entity), SocialAnswerDtoForm.class);
    }

    @Override
    public Page<SocialAnswerDto> getAnswers(Predicate predicate, Pageable pageable) {
        Page<SocialNetworkAnswer> answerPage = socialNetworkAnswerService.findAll(predicate, pageable);
        return conversionService.convertToPage(pageable, answerPage, SocialAnswerDto.class);
    }

    @Override
    public List<SocialNetworkAnswerHeadDto> getSocialAnswersReport(Predicate predicate, Pageable pageable) {
        List<SocialNetworkAnswerSalesHeadView> content = socialNetworkAnswerService.findSalesHeadViews(predicate, pageable)
                .getContent();
        return content.stream()
                .map(this::convertAndSetDateForReport)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public SocialAnswerDto updateAnswer(Long id, SocialAnswerDto answerDto) {
        if (!id.equals(answerDto.getId())) {
            throw new IllegalArgumentException("Can't match answer dto. Id:" + id + ", answer id:" + answerDto.getId());
        }
        if (answerDto.getCompanyDto().getName() == null) {
            throw new IllegalArgumentException("Can't update with company name equals null.");
        }
        if (answerDto.getCompanyDto().getId() == null) {
            throw new IllegalArgumentException("Can't update with company id equals null.");
        }
        validateAnswerDto(answerDto);
        SocialNetworkAnswer answer = conversionService.convert(answerDto, SocialNetworkAnswer.class);
        SocialNetworkAnswer persisted = socialNetworkAnswerService.findById(answerDto.getId());
        modelMapper.map(answer, persisted);
        Optional.ofNullable(answer.getCountry()).ifPresent(country ->
                persisted.setCountry(countryService.findById(country.getId())));

        Optional.ofNullable(answerDto.getDateOfBirth())
                .ifPresent(date -> persisted.setDateOfBirth(CrmLocalDateUtils.convertStringToLocalDate(date)));
        return conversionService.convert(socialNetworkAnswerService.update(persisted), SocialAnswerDto.class);
    }

    @Override
    public void saveAnswers(List<Long> ids) {
        ids.forEach(this::saveAnswer);
    }

    @Override
    public void deleteAnswer(Long id) {
        socialNetworkAnswerService.deleteAnswer(id);
    }

    @Override
    public void rejectAnswers(List<Long> ids) {
        ids.forEach(socialNetworkAnswerService::rejectAnswer);
    }

    @Override
    public void returnAnswers(List<Long> ids) {
        ids.forEach(socialNetworkAnswerService::returnAnswer);
    }

    @Override
    public List<RatingNCReportResponse> getAllRatingsNCBetweenDate(LocalDate createFrom, LocalDate createTo, Sort sort) {
        Pageable pageable = new PageRequest(0, Integer.MAX_VALUE, sort);
        Page<RatingNCResponse> page = socialNetworkAnswerService.getRatingsNC(createFrom, createTo, pageable);
        List<RatingNCReportResponse> ratings = conversionService.convertToList(page.getContent(),RatingNCReportResponse.class);
        int number = 1;
        for (RatingNCReportResponse rating : ratings) {
            rating.setNumber(number++);
        }
        return ratings;
    }

    private void saveAnswer(Long id) {
        SocialNetworkAnswer answer = socialNetworkAnswerService.findById(id);
        Company company = defineCompany(answer);
        Contact contact = defineContact(answer, company);
        CompanySale companySale = defineCompanySale(company, contact, answer);
        Activity activity = defineActivity(answer, contact, companySale);
        socialNetworkAnswerService.transferToSaveAndSetApplied(answer, company, contact, companySale, activity);
    }

    private Company defineCompany(SocialNetworkAnswer answer) {
        String companyName = answer.getCompanyName();
        Company company = companyService.findCompanyByName(companyName);
        if (company == null) {
            company = new Company();
            company.setName(companyName);
            company.setCreateDate(LocalDateTime.now());
            Optional.ofNullable(answer.getPhoneCompany()).ifPresent(company::setPhone);
            Optional.ofNullable(answer.getSite()).ifPresent(company::setUrl);
        }
        company.setIsActive(true);
        return company;
    }

    private void validateCreate(SocialAnswerDtoForm dto) {
        dto.setId(null);
        socialNetworkContactService.validateById(dto.getSocialNetworkContactId());
        countryService.validateById(dto.getCountryId());
    }

    private void validateAnswerDto(SocialAnswerDto answerDto) {
        validateAnswerById(answerDto.getId());
        countryService.validateById(answerDto.getCountryDto().getId());
    }

    private void validateAnswerById(Long id) {
        if (!socialNetworkAnswerService.exist(id)) {
            throw new EntityNotFoundException("Social network contact not found: " + id);
        }
    }

    private Contact defineContact(SocialNetworkAnswer answer, Company company) {
        Contact contact = new Contact();
        contact.setIsActive(true);
        contact.setFirstName(answer.getFirstName());
        contact.setLastName(answer.getLastName());
        contact.setPersonalEmail(answer.getEmailPrivate());
        contact.setEmail(answer.getEmail());
        contact.setPosition(answer.getPosition());
        contact.setCompany(company);
        contact.setCountry(answer.getCountry());
        contact.setSex(answer.getSex());
        contact.setPhone(answer.getPhone());
        contact.setSkype(answer.getSkype());
        contact.setSocialNetwork(answer.getLinkLead());
        contact.setSocialNetworkUser(answer.getSocialNetworkContact().getSocialNetworkUser());
        contact.setDateOfBirth(answer.getDateOfBirth());
        return contact;
    }

    private CompanySale defineCompanySale(Company company, Contact contact, SocialNetworkAnswer answer) {
        CompanySale companySale = new CompanySale();
        companySale.setCompany(company);
        companySale.setStatus(CompanySale.Status.LEAD);
        companySale.setMainContact(contact);
        companySale.setResponsible(authenticatedUser.getCurrentEmployee());
        companySale.setStatusChangedDate(LocalDateTime.now());
        companySale.setWeight(-1L);
        companySale.setNextActivityDate(LocalDateTime.now());
        companySale.setSource(answer.getSource());
        return companySale;
    }

    private Activity defineActivity(SocialNetworkAnswer answer, Contact contact, CompanySale companySale) {
        Activity activity = new Activity();
        activity.setContacts(new HashSet<>(Collections.singletonList(contact)));
        activity.setDateActivity(answer.getCreateDate());
        activity.setDescription(answer.getMessage());
        activity.setCompanySale(companySale);
        activity.setResponsible(authenticatedUser.getCurrentEmployee());
        ActivityType type = ActivityType.builder()
                .type(Activity.TypeEnum.SOCIAL_NETWORK.toString())
                .activity(activity).build();
        activity.setActivityTypes(Collections.singleton(type));
        return activity;
    }

    private SocialNetworkAnswerHeadDto convertAndSetDateForReport(SocialNetworkAnswerSalesHeadView socialNetworkAnswerSalesHeadView) {
        String format = "dd MMM. yyyy HH:mm";
        SocialNetworkAnswerHeadDto socialNetworkAnswerHeadDto = conversionService.convert(socialNetworkAnswerSalesHeadView, SocialNetworkAnswerHeadDto.class);
        socialNetworkAnswerHeadDto.setCreateDate(socialNetworkAnswerSalesHeadView.getCreateDate().format(DateTimeFormatter.ofPattern(format, new Locale("ru"))));
        return socialNetworkAnswerHeadDto;
    }
}
