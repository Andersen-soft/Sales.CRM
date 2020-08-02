package com.andersenlab.crm.services.impl;

import com.andersenlab.crm.dbtools.dto.CompanyReport;
import com.andersenlab.crm.dbtools.dto.ContactReport;
import com.andersenlab.crm.dbtools.dto.ResumeProcessingReport;
import com.andersenlab.crm.dbtools.mapper.CompanyReportMapper;
import com.andersenlab.crm.dbtools.mapper.ContactReportMapper;
import com.andersenlab.crm.dbtools.mapper.ResumeProcessingReportMapper;
import com.andersenlab.crm.services.Exporter;
import com.andersenlab.crm.services.resources.ResourcesService;
import com.google.common.collect.ImmutableMap;
import lombok.AllArgsConstructor;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;

import java.sql.PreparedStatement;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@AllArgsConstructor
@Component
public class ExporterReportData implements Exporter {

    private final NamedParameterJdbcTemplate jdbcTemplate;
    private final ContactReportMapper contactReportMapper;
    private final CompanyReportMapper companyReportMapper;
    private final ResumeProcessingReportMapper resumeProcessingReportMapper;
    private final ResourcesService resourcesService;

    private static final String CONTACT_REQUEST = "contact_report_request.sql";
    private static final String COMPANY_REQUEST = "company_report_request.sql";
    private static final String SQL_FIX_GROUP_CONTACT_LENGTH = "SET SESSION group_concat_max_len = :len";
    private static final String RESUME_REQUEST = "resume-processing-report.sql";

    @Override
    public List<ContactReport> getContactsForReport(final LocalDate createDateFrom, final LocalDate createDateTo) {
        jdbcTemplate.execute(
                SQL_FIX_GROUP_CONTACT_LENGTH,
                ImmutableMap.of("len", Integer.MAX_VALUE),
                PreparedStatement::execute
        );
        return getReport(contactReportMapper, getDateRange(createDateFrom, createDateTo), CONTACT_REQUEST);
    }

    @Override
    public List<CompanyReport> getCompaniesForReport(final LocalDate createDateFrom, final LocalDate createDateTo) {
        return getReport(companyReportMapper, getDateRange(createDateFrom, createDateTo), COMPANY_REQUEST);
    }

    @Override
    public List<ResumeProcessingReport> getResumesForProcessingReport(LocalDate createDateFrom, LocalDate createDateTo) {
        return getReport(resumeProcessingReportMapper, getDateRange(createDateFrom, createDateTo), RESUME_REQUEST);
    }

    private <T> List<T> getReport(final RowMapper<T> mapper, final ImmutableMap<String, Object> params, final String query) {
        return jdbcTemplate.query(resourcesService.loadTemplate(query), params, mapper);
    }

    private ImmutableMap<String, Object> getDateRange(final LocalDate createDateFrom, final LocalDate createDateTo) {
        if (createDateFrom.isBefore(createDateTo)) {
            return ImmutableMap.of(
                    "createDateFrom", createDateFrom.atStartOfDay(),
                    "createDateTo", createDateTo.atTime(LocalTime.MAX)
            );
        } else {
            return ImmutableMap.of(
                    "createDateFrom", createDateTo.atStartOfDay(),
                    "createDateTo", createDateFrom.atTime(LocalTime.MAX)
            );
        }
    }
}
