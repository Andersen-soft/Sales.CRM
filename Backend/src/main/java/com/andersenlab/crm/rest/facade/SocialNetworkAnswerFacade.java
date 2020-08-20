package com.andersenlab.crm.rest.facade;

import com.andersenlab.crm.rest.dto.SocialAnswerDtoForm;
import com.andersenlab.crm.rest.dto.SocialNetworkAnswerHeadDto;
import com.andersenlab.crm.rest.response.RatingNCReportResponse;
import com.andersenlab.crm.rest.response.SocialAnswerDto;
import com.querydsl.core.types.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.time.LocalDate;
import java.util.List;

public interface SocialNetworkAnswerFacade {

    SocialAnswerDtoForm create(SocialAnswerDtoForm dto);

    Page<SocialAnswerDto> getAnswers(Predicate predicate, Pageable pageable);

    List<SocialNetworkAnswerHeadDto> getSocialAnswersReport(Predicate predicate, Pageable pageable);

    SocialAnswerDto updateAnswer(Long id, SocialAnswerDto answerDto);

    void saveAnswers(List<Long> ids);

    void deleteAnswer(Long id);

    void rejectAnswers(List<Long> ids);

    void returnAnswers(List<Long> ids);

    List<RatingNCReportResponse> getAllRatingsNCBetweenDate(LocalDate createFrom, LocalDate createTo, Sort sort);
}
