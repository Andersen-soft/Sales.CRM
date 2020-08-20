package com.andersenlab.crm.rest.facade;

import com.andersenlab.crm.rest.request.ReportRequestFilter;
import com.querydsl.core.types.Predicate;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.time.LocalDate;

public interface ReportFile {

    byte[] getReport(Predicate predicate, ReportRequestFilter filter);

    byte[] getActivitiesReport(LocalDate creationFrom, LocalDate creationTo);

    byte[] getResumeRequestReport(Predicate predicate, Pageable pageable);

    byte[] getSocialAnswersReport(Predicate predicate);

    byte[] getEstimationsRequestReport(Predicate predicate, Pageable pageable);

    byte[] getResumeReport(Predicate predicate);

    byte[] getCompanyReport(LocalDate createDateFrom, LocalDate createDateTo);

    byte[] getContactReport(LocalDate createDateFrom, LocalDate createDateTo);

    byte[] getResumeProcessingReport(LocalDate createDateFrom, LocalDate createDateTo);

    byte[] getRatingsNCReport(LocalDate createFrom, LocalDate createTo, Sort sort);
}
