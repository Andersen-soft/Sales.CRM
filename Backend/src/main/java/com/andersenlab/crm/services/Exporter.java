package com.andersenlab.crm.services;

import com.andersenlab.crm.dbtools.dto.CompanyReport;
import com.andersenlab.crm.dbtools.dto.ContactReport;
import com.andersenlab.crm.dbtools.dto.ResumeProcessingReport;

import java.time.LocalDate;
import java.util.List;

public interface Exporter {
    List<ContactReport> getContactsForReport(LocalDate createDateFrom, LocalDate createDateTo);

    List<CompanyReport> getCompaniesForReport(LocalDate createDateFrom, LocalDate createDateTo);
    
    List<ResumeProcessingReport> getResumesForProcessingReport(LocalDate createDateFrom, LocalDate createDateTo);
}
