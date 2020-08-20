package com.andersenlab.crm.services.scheduler;

import com.andersenlab.crm.configuration.properties.ApplicationProperties;
import com.andersenlab.crm.configuration.properties.SkypeProperties;
import com.andersenlab.crm.rest.dto.estimationrequest.EstimationRequestSkypeDto;
import com.andersenlab.crm.services.impl.SkypeBotSender;
import com.andersenlab.crm.services.resources.ResourcesService;
import com.google.common.collect.ImmutableMap;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

import static com.andersenlab.crm.utils.SkypeBotHelper.getDateTime;
import static com.andersenlab.crm.utils.SkypeBotHelper.getIdleHoursString;
import static com.andersenlab.crm.utils.SkypeBotHelper.getLong;
import static com.andersenlab.crm.utils.SkypeBotHelper.getString;
import static com.andersenlab.crm.utils.SkypeBotHelper.ifEmptyOr;

@Component
@RequiredArgsConstructor
public class EstimationRequestScheduler {
    private final SkypeBotSender skypeBotSender;
    private final NamedParameterJdbcTemplate jdbcTemplate;
    private final ResourcesService resourcesService;

    private final SkypeProperties skypeProperties;
    private final ApplicationProperties applicationProperties;

    private static final String REPORT_NAME = "estimation-request-report.sql";

    public void sendEstimationRequestReport() {
        final LocalDateTime statusChangedExpires = LocalDateTime.now().minusDays(1);
        final String query = resourcesService.loadTemplate(REPORT_NAME);
        final ImmutableMap<String, Object> params = ImmutableMap.of("statusChangedExpires", statusChangedExpires);
        final List<EstimationRequestSkypeDto> requests = jdbcTemplate.query(query, params, (resultSet, i) -> getDto(resultSet));
        String message = defineMessage(requests);
        skypeBotSender.send(skypeProperties.getChat().getEstimation(), "", message);
    }

    private EstimationRequestSkypeDto getDto(ResultSet rs) {
        final Long id = getLong(rs, "id");
        final String companyName = getString(rs, "company_name");
        final String name = getString(rs, "name");
        final String status = getString(rs, "status");
        final String responsible = getString(rs, "responsible");
        final Timestamp timestamp = getDateTime(rs, "status_changed_date");
        final LocalDateTime statusChangedDate = timestamp == null ? null : timestamp.toLocalDateTime();
        return new EstimationRequestSkypeDto(id, companyName, name, status, responsible, statusChangedDate);
    }

    private String defineMessage(final List<EstimationRequestSkypeDto> requests) {
        return requests.stream()
                .reduce(new StringBuilder(), (result, dto) -> getEstimationRequestString(dto, result), StringBuilder::append)
                .toString();
    }

    private StringBuilder getEstimationRequestString(final EstimationRequestSkypeDto request, final StringBuilder builder) {
        final String expireTime = getIdleHoursString(request.getStatusChangedDate());
        final String requestLink = String.format("<a href='%s%s%d'>%d</a>",
                applicationProperties.getUrl(),
                skypeProperties.getUrl().getEstimationRequest(),
                request.getId(),
                request.getId());
        return builder
                .append("\r\n")
                .append(requestLink)
                .append(ifEmptyOr(request.getCompanyName()))
                .append(ifEmptyOr(request.getName()))
                .append(ifEmptyOr(request.getStatus()))
                .append(ifEmptyOr(request.getResponsible()))
                .append(expireTime);
    }
}
