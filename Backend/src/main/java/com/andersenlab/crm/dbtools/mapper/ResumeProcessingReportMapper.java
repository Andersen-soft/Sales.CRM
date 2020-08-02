package com.andersenlab.crm.dbtools.mapper;

import com.andersenlab.crm.dbtools.dto.ResumeProcessingReport;
import com.andersenlab.crm.utils.CrmReportUtils;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Component
public class ResumeProcessingReportMapper implements RowMapper<ResumeProcessingReport> {
	
	private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
	
	@Override
	public ResumeProcessingReport mapRow(ResultSet resultSet, int i) throws SQLException {
		ResumeProcessingReport report = new ResumeProcessingReport();
		
		report.setId(resultSet.getLong("id"));
		report.setRequestName(report.getId() + " - " + resultSet.getString("request_name"));
		report.setCompanyName(resultSet.getString("company_name"));
		report.setResponsibleName(resultSet.getString("resp_name"));
		report.setResponsibleRmName(resultSet.getString("resp_rm_name"));
		report.setResponsibleHrName(resultSet.getString("resp_hr_name"));
		report.setResumeId(resultSet.getLong("resume_id"));
		report.setFio(resultSet.getString("fio"));
		calcDuration(report, resultSet);
		insertHyperlink(report);
		
		return report;
	}
	
	private void calcDuration(ResumeProcessingReport report, ResultSet rs) throws SQLException {
		LocalDateTime from = LocalDateTime.parse(rs.getString("create_date"), FORMATTER);
		LocalDateTime to = LocalDateTime.parse(rs.getString("done_date"), FORMATTER);
		long durationInMinutes = Duration.between(from, to).toMinutes();
		report.setDurationInMinutes(durationInMinutes);
	}
	
	private void insertHyperlink(ResumeProcessingReport report) {
		String id = report.getId().toString();
		String requestName = CrmReportUtils.composeHyperlinkForLocale(report.getRequestName(), id, "/resume-requests/{id}", Locale.ENGLISH);
		report.setRequestName(requestName);
	}
}
