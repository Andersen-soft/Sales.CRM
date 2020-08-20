package com.andersenlab.crm.services;

import com.andersenlab.crm.model.entities.Activity;
import com.andersenlab.crm.model.entities.Company;
import com.andersenlab.crm.model.entities.CompanySale;
import com.andersenlab.crm.model.entities.Contact;
import com.andersenlab.crm.model.entities.SocialNetworkAnswer;
import com.andersenlab.crm.model.view.SocialNetworkAnswerSalesHeadView;
import com.andersenlab.crm.rest.response.RatingNCForNCResponse;
import com.andersenlab.crm.rest.response.RatingNCResponse;
import com.querydsl.core.types.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface SocialNetworkAnswerService {

    SocialNetworkAnswer create(SocialNetworkAnswer socialNetworkAnswer);

    SocialNetworkAnswer update(SocialNetworkAnswer socialNetworkAnswer);

    Page<SocialNetworkAnswer> findAll(Predicate predicate, Pageable pageable);

    Page<SocialNetworkAnswerSalesHeadView> findSalesHeadViews(Predicate predicate, Pageable pageable);

    SocialNetworkAnswer findById(Long id);

    void rejectAnswer(Long id);

    void transferToSaveAndSetApplied(
            SocialNetworkAnswer answer, Company company, Contact contact, CompanySale companySale, Activity activity);

    void deleteAnswer(Long id);

    boolean exist(Long id);

    void returnAnswer(Long id);

    Map<String, String> getStatistic(LocalDate createdFrom, LocalDate createdTo);

    List<String> getStatuses(Predicate predicate, Pageable pageable);

    Page<RatingNCResponse> getRatingsNC(LocalDate createdFrom, LocalDate createdTo, Pageable pageable);

    Page<RatingNCForNCResponse> getRatingsNCforNC(Pageable pageable);
}
