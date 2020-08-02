package com.andersenlab.crm.services.impl;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.events.SocialNetworkAnswerCreateEvent;
import com.andersenlab.crm.model.entities.Activity;
import com.andersenlab.crm.model.entities.Company;
import com.andersenlab.crm.model.entities.CompanySale;
import com.andersenlab.crm.model.entities.Contact;
import com.andersenlab.crm.model.entities.SocialNetworkAnswer;
import com.andersenlab.crm.model.view.SocialNetworkAnswerSalesHeadView;
import com.andersenlab.crm.repositories.ActivityRepository;
import com.andersenlab.crm.repositories.CompanyRepository;
import com.andersenlab.crm.repositories.ContactRepository;
import com.andersenlab.crm.repositories.SocialNetworkAnswerRepository;
import com.andersenlab.crm.repositories.SocialNetworkAnswerSalesHeadViewRepository;
import com.andersenlab.crm.rest.response.RatingNCForNCResponse;
import com.andersenlab.crm.rest.response.RatingNCResponse;
import com.andersenlab.crm.services.ActivityService;
import com.andersenlab.crm.services.CompanySaleServiceNew;
import com.andersenlab.crm.services.SocialNetworkAnswerService;
import com.querydsl.core.types.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.JpaSort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
@RequiredArgsConstructor
public class SocialNetworkAnswerServiceImpl implements SocialNetworkAnswerService {

    private final SocialNetworkAnswerRepository socialNetworkAnswerRepository;
    private final SocialNetworkAnswerSalesHeadViewRepository socialNetworkAnswerSalesHeadViewRepository;
    private final ContactRepository contactRepository;
    private final CompanySaleServiceNew companySaleService;
    private final ActivityRepository activityRepository;
    private final ActivityService activityService;
    private final CompanyRepository companyRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final ConversionService conversionService;

    @Override
    @Transactional
    public SocialNetworkAnswer create(SocialNetworkAnswer socialNetworkAnswer) {
        SocialNetworkAnswer answer = socialNetworkAnswerRepository.saveAndFlush(socialNetworkAnswer);
        eventPublisher.publishEvent(new SocialNetworkAnswerCreateEvent(answer));
        return answer;
    }

    @Override
    @Transactional
    public SocialNetworkAnswer update(SocialNetworkAnswer socialNetworkAnswer) {
        return socialNetworkAnswerRepository.saveAndFlush(socialNetworkAnswer);
    }

    @Override
    @Transactional
    public Page<SocialNetworkAnswer> findAll(Predicate predicate, Pageable pageable) {
        return socialNetworkAnswerRepository.findAll(predicate, pageable);
    }

    @Override
    public Page<SocialNetworkAnswerSalesHeadView> findSalesHeadViews(Predicate predicate, Pageable pageable) {
        return socialNetworkAnswerSalesHeadViewRepository.findAll(predicate, pageable);
    }

    @Override
    public SocialNetworkAnswer findById(Long id) {
        return Optional.ofNullable(socialNetworkAnswerRepository.findOne(id))
                .orElseThrow(() -> new EntityNotFoundException(String.format("Social network answer not found, id: %s", id)));
    }

    @Override
    @Transactional
    public void transferToSaveAndSetApplied(
            SocialNetworkAnswer answer,
            Company company,
            Contact contact,
            CompanySale companySale,
            Activity activity
    ) {
        companyRepository.saveAndFlush(company);
        contactRepository.saveAndFlush(contact);
        CompanySale savedSale = companySaleService.createSale(companySale);

        Activity savedActivity = activityRepository.saveAndFlush(activity);
        activityService.refreshSaleActivities(savedSale, savedActivity);

        answer.setStatus(SocialNetworkAnswer.Status.APPLY);
        socialNetworkAnswerRepository.saveAndFlush(answer);
    }

    @Override
    public void deleteAnswer(Long id) {
        socialNetworkAnswerRepository.delete(id);
    }

    @Override
    public boolean exist(Long id) {
        return socialNetworkAnswerRepository.exists(id);
    }

    @Override
    @Transactional
    public void rejectAnswer(Long id) {
        changeStatus(id, SocialNetworkAnswer.Status.REJECT);
    }

    @Override
    @Transactional
    public void returnAnswer(Long id) {
        changeStatus(id, SocialNetworkAnswer.Status.AWAIT);
    }

    @Override
    public Map<String, String> getStatistic(LocalDate createdFrom, LocalDate createdTo) {
        final Map<String, String> statistic =
                socialNetworkAnswerSalesHeadViewRepository.getStatistic(createdFrom.atTime(LocalTime.MIN), createdTo.atTime(LocalTime.MAX))
                .stream()
                .collect(Collectors.toMap(k -> k[0].toString(), v -> v[1].toString()));
        Arrays.stream(SocialNetworkAnswer.Status.values()).forEach(status -> statistic.putIfAbsent(status.name(), "0"));
        return statistic;
    }

    @Override
    public List<String> getStatuses(Predicate predicate, Pageable pageable) {
        return StreamSupport
                .stream(socialNetworkAnswerSalesHeadViewRepository.findAll(predicate, pageable.getSort()).spliterator(), false)
                .map(SocialNetworkAnswerSalesHeadView::getStatus)
                .map(SocialNetworkAnswer.Status::getName)
                .filter(Objects::nonNull)
                .distinct()
                .collect(Collectors.toList());
    }

    @Override
    public Page<RatingNCResponse> getRatingsNC(LocalDate createdFrom, LocalDate createdTo, Pageable pageable) {

        /*
        Bug bypass spring-data-jpa
        https://stackoverflow.com/questions/43993952/how-to-sort-projection-by-alias-from-select-clause-in-spring-data-jpa-with-pagin
         */

        Pageable pageRequest = pageable;
        Sort sort  = pageable.getSort();
        if (sort != null) {
            Iterator<Sort.Order> iterator = pageable.getSort().iterator();
            if (iterator.hasNext()) {
                Sort.Order order = iterator.next();
                JpaSort unsafeSort = JpaSort.unsafe(order.getDirection(), '(' +order.getProperty() + ')');
                iterator.forEachRemaining(o ->  unsafeSort.andUnsafe(o.getDirection(), '(' + o.getProperty() + ')'));
                pageRequest = new PageRequest(pageable.getPageNumber(), pageable.getPageSize(), unsafeSort);
            }
        }
        return socialNetworkAnswerRepository.getReportsNC(Timestamp.valueOf(createdFrom.atStartOfDay()), Timestamp.valueOf(createdTo.atTime(LocalTime.MAX)), pageRequest);
    }

    @Override
    public Page<RatingNCForNCResponse> getRatingsNCforNC(Pageable pageable) {
        LocalDate createTo = LocalDate.now();
        LocalDate createFrom = createTo.withDayOfMonth(1);
        return conversionService.convertToPage(pageable, getRatingsNC(createFrom, createTo, pageable),
                RatingNCForNCResponse.class);
    }

    private void changeStatus(Long id, SocialNetworkAnswer.Status status) {
        SocialNetworkAnswer answer = socialNetworkAnswerRepository.findOne(id);
        answer.setStatus(status);
        socialNetworkAnswerRepository.saveAndFlush(answer);
    }

}
