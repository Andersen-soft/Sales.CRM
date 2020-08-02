package com.andersenlab.crm.services.scheduler;

import com.andersenlab.crm.configuration.properties.ApplicationProperties;
import com.andersenlab.crm.configuration.properties.SkypeProperties;
import com.andersenlab.crm.rest.dto.resumerequest.ResumeRequestSkypeDto;
import com.andersenlab.crm.rest.dto.resumerequest.ResumeSkypeDto;
import com.andersenlab.crm.services.impl.SkypeBotSender;
import com.andersenlab.crm.services.resources.ResourcesService;
import com.google.common.collect.ImmutableMap;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.RowCallbackHandler;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import static com.andersenlab.crm.utils.SkypeBotHelper.getDateTime;
import static com.andersenlab.crm.utils.SkypeBotHelper.getIdleHoursString;
import static com.andersenlab.crm.utils.SkypeBotHelper.getLong;
import static com.andersenlab.crm.utils.SkypeBotHelper.getString;
import static com.andersenlab.crm.utils.SkypeBotHelper.ifEmptyOr;

@Component
@RequiredArgsConstructor
public class ResumeRequestSkypeScheduler {
    private final SkypeBotSender skypeBotSender;
    private final NamedParameterJdbcTemplate jdbcTemplate;
    private final ResourcesService resourcesService;

    private final SkypeProperties skypeProperties;
    private final ApplicationProperties applicationProperties;

    private static final String REPORT_NAME = "resume-request-report.sql";

    public void sendActivityReports() {
        final LocalDateTime now = LocalDateTime.now();
        final LocalDateTime statusChangedExpires;
        if (now.getHour() < 16) {
            statusChangedExpires = LocalDateTime.of(now.toLocalDate().minusDays(1), LocalTime.of(16, 0, 0));
        } else {
            statusChangedExpires = LocalDateTime.of(now.toLocalDate(), LocalTime.of(11, 0, 0));
        }
        final ImmutableMap<String, Object> params = ImmutableMap.of("statusChangedExpires", statusChangedExpires);
        final Map<Long, ResumeRequestSkypeDto> requests = new HashMap<>();
        final String query = resourcesService.loadTemplate(REPORT_NAME);
        jdbcTemplate.query(query, params, (RowCallbackHandler) resultSet -> processRow(resultSet, requests));
        final String message = defineMessage(requests.values());
        skypeBotSender.send(skypeProperties.getChat().getCv(), "", message);
    }

    private ResumeRequestSkypeDto getRequestDtoFromResultSet(ResultSet rs) {
        final Long id = getLong(rs, "id");
        final String company = getString(rs, "company_name");
        final String name = getString(rs, "request_name");
        final String status = getString(rs, "request_status");
        final String responsible = getString(rs, "full_name");
        final String priority = getString(rs, "priority");
        final Timestamp timestamp = getDateTime(rs, "request_status_changed_date");
        final LocalDateTime statusChangedDate = timestamp == null ? null : timestamp.toLocalDateTime();
        return new ResumeRequestSkypeDto(id, company, name, status, responsible, priority, statusChangedDate, new HashSet<>());
    }

    private ResumeSkypeDto getResumeDtoFromResultSet(ResultSet rs) {
        final Long id = getLong(rs, "resume_id");
        final String fio = getString(rs, "fio");
        final String status = getString(rs, "resume_status");
        final String responsible = getString(rs, "responsible_for_resume");
        final Timestamp timestamp = getDateTime(rs, "resume_status_changed_date");
        final LocalDateTime statusChangedDate = timestamp == null ? null : timestamp.toLocalDateTime();
        return id == 0 ? null : new ResumeSkypeDto(id, fio, status, responsible, statusChangedDate);
    }

    private void processRow(ResultSet rs, final Map<Long, ResumeRequestSkypeDto> requests) {
        final ResumeRequestSkypeDto request = getRequestDtoFromResultSet(rs);
        requests.putIfAbsent(request.getId(), request);
        ResumeSkypeDto resume = getResumeDtoFromResultSet(rs);
        requests.computeIfPresent(request.getId(), (id, resumeRequestSkypeDto) -> {
            Optional.ofNullable(resume).ifPresent(it -> resumeRequestSkypeDto.getResumes().add(it));
            return resumeRequestSkypeDto;
        });
    }

    private String defineMessage(final Collection<ResumeRequestSkypeDto> requestToSend) {
        return requestToSend.stream()
                .reduce(new StringBuilder(), (result, dto) -> getResumeRequestString(dto, result), StringBuilder::append)
                .toString();
    }

    private StringBuilder getResumeRequestString(final ResumeRequestSkypeDto request, final StringBuilder builder) {
        final String requestLink = String.format("<a href='%s%s%d'>%d</a>",
                applicationProperties.getUrl(),
                skypeProperties.getUrl().getResumeRequest(),
                request.getId(),
                request.getId());
        builder
                .append("\r\n")
                .append(requestLink)
                .append(ifEmptyOr(request.getCompany()))
                .append(ifEmptyOr(request.getName()))
                .append(ifEmptyOr(request.getStatus()))
                .append(ifEmptyOr(request.getResponsible()))
                .append(ifEmptyOr(request.getPriority()));
        final Set<ResumeSkypeDto> resumes = request.getResumes();
        boolean isResumesPresent = !resumes.isEmpty();
        if (!isResumesPresent) {
            builder.append(getIdleHoursString(request.getStatusChangedDate()));
        } else {
            builder.append(":");
            resumes.stream()
                    .reduce(builder, (resumeResult, dto) -> getResumeString(dto, resumeResult), StringBuilder::append);
        }
        return builder.append("\r\n");
    }

    private StringBuilder getResumeString(final ResumeSkypeDto resume, final StringBuilder builder) {
        final String expireTime = getIdleHoursString(resume.getStatusChangedDate());
        return builder.append("\r\n \u25CF ")
                .append(ifEmptyOr(resume.getFio()).replaceFirst(" - ", ""))
                .append(ifEmptyOr(resume.getStatus()))
                .append(ifEmptyOr(resume.getResponsible()))
                .append(expireTime);
    }
}
