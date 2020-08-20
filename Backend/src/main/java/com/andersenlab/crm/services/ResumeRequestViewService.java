package com.andersenlab.crm.services;

import com.andersenlab.crm.dbtools.dto.ResumeProcessingReport;
import com.andersenlab.crm.model.view.AllResumeRequestsView;
import com.andersenlab.crm.rest.dto.resumerequest.ResumeProcessingReportRowDTO;
import com.querydsl.core.types.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface ResumeRequestViewService {
    Page<AllResumeRequestsView> get(Predicate predicate, Pageable pageable);

    AllResumeRequestsView get(Long id);
    
    List<ResumeProcessingReport> getResumeProcessingReports(LocalDate createDateFrom, LocalDate createDateTo);

    List<ResumeProcessingReportRowDTO> getResumeProcessingReportRows(LocalDate createDateFrom, LocalDate createDateTo);

}
