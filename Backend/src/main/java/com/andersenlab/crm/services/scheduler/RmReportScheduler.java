package com.andersenlab.crm.services.scheduler;

import com.andersenlab.crm.dbtools.dto.rmreport.EmployeeDto;
import com.andersenlab.crm.dbtools.dto.rmreport.MessageDto;
import com.andersenlab.crm.dbtools.dto.rmreport.RequestDto;
import com.andersenlab.crm.dbtools.dto.rmreport.ResumeDto;
import com.andersenlab.crm.model.Message;
import com.andersenlab.crm.model.RecipientDto;
import com.andersenlab.crm.model.RoleEnum;
import com.andersenlab.crm.model.entities.QEmployee;
import com.andersenlab.crm.model.entities.Resume;
import com.andersenlab.crm.model.entities.ResumeRequest;
import com.andersenlab.crm.repositories.EmployeeRepository;
import com.andersenlab.crm.services.MailService;
import com.andersenlab.crm.services.resources.ResourcesService;
import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableMap;
import com.querydsl.core.types.dsl.BooleanExpression;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.util.Strings;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

import static com.andersenlab.crm.utils.SkypeBotHelper.getLong;
import static com.andersenlab.crm.utils.SkypeBotHelper.getString;

@Component
@RequiredArgsConstructor
public class RmReportScheduler {
    private final MailService mailService;
    private final EmployeeRepository employeeRepository;
    private final NamedParameterJdbcTemplate jdbcTemplate;
    private final ResourcesService resourcesService;

    @Value("${app.url}")
    private String appUrl;

    private static final String RM_ESTIMATION_REQUEST = "rm-report/rm-estimation-request-report.sql";
    private static final String RM_RESUME_REQUEST = "rm-report/rm-resume-request-report.sql";
    private static final String URL_TEMPLATE_RESUME_REQUESTS = "%s/resume-requests/%s";
    private static final String URL_TEMPLATE_ESTIMATION_REQUEST = "%s/estimation-requests/%s";

    @Scheduled(cron = "0 50 8 ? * MON-FRI", zone = "GMT+3")
    public void sendReports() {
        prepareRequests(requests(RM_ESTIMATION_REQUEST, URL_TEMPLATE_ESTIMATION_REQUEST), RequestDto::getResponsible);
        final Map<EmployeeDto, List<RequestDto>> estimationRequests =
                prepareRequests(requests(RM_ESTIMATION_REQUEST, URL_TEMPLATE_ESTIMATION_REQUEST), RequestDto::getResponsible);
        final Map<EmployeeDto, List<RequestDto>> resumeRequests =
                prepareRequests(getResumeRequest(), RequestDto::getResponsible);
        final Set<EmployeeDto> recipients = Stream.concat(resumeRequests.keySet().stream(), estimationRequests.keySet()
                .stream())
                .collect(Collectors.toSet());

        final List<MessageDto> resumeRequestMessages = new ArrayList<>();

        recipients.stream()
                .filter(Objects::nonNull)
                .forEach(recipient -> {
                    MessageDto resumeRequestDto = getResumeRequestMessage(recipient.getName(),
                            Optional.ofNullable(resumeRequests.get(recipient)).orElse(ImmutableList.of()));
                    MessageDto estimationRequestDto = getResumeRequestMessage(recipient.getName(),
                            Optional.ofNullable(estimationRequests.get(recipient)).orElse(ImmutableList.of()));
                    mailService.sendMail(
                            RecipientDto.builder().contact(recipient.getEmail()).build(),
                            defineRmMessage(resumeRequestDto, estimationRequestDto)
                    );
                    resumeRequestDto.setRequests(
                            resumeRequestDto.getRequests().stream().filter(request -> !request.getResumes().isEmpty()
                                    || request.getStatus().equals(ResumeRequest.Status.CTO_NEED.getName())
                            ).collect(Collectors.toList())
                    );
                    resumeRequestMessages.add(resumeRequestDto);
                });

        final BooleanExpression employeePredicate = QEmployee.employee.isActive.eq(true)
                .and(QEmployee.employee.roles.any().name.eq(RoleEnum.ROLE_SALES_HEAD));
        final List<RecipientDto> salesHeads = StreamSupport
                .stream(employeeRepository.findAll(employeePredicate).spliterator(), false)
                .map(it -> RecipientDto.builder().contact(it.getEmail()).build())
                .collect(Collectors.toList());

        mailService.sendMail(salesHeads, defineHeadMessage(resumeRequestMessages));
    }

    private <T, K extends EmployeeDto> Map<EmployeeDto,
            List<T>> prepareRequests(List<T> iterable, Function<T, K> consumer) {
        return iterable
                .stream()
                .collect(Collectors.groupingBy(consumer));
    }

    private Message defineRmMessage(final MessageDto resumeRequests, final MessageDto estimationRequests) {
        final ImmutableMap<String, Object> args = ImmutableMap.of(
                "resume_request", resumeRequests,
                "estimation_request", estimationRequests
        );
        return new Message("CTO need (CV) / Approve Need (Estimation)", Strings.EMPTY, args, Message.Template.SALES_REQUEST_FOR_RM);
    }

    private Message defineHeadMessage(final List<MessageDto> requests) {
        final ImmutableMap<String, Object> args = ImmutableMap.of("resume_requests", requests);
        return new Message("CV - CTO need", Strings.EMPTY, args, Message.Template.SALES_REQUEST_FOR_LEAD);
    }

    private List<RequestDto> getResumeRequest() {
        return requests(RM_RESUME_REQUEST, URL_TEMPLATE_RESUME_REQUESTS)
                .stream()
                .collect(Collectors.groupingBy(RequestDto::getId))
                .values()
                .stream()
                .map(requestDtos ->
                        requestDtos
                                .stream()
                                .reduce(requestDtos.get(0), (result, dto) -> accumulator(dto, result))
                )
                .collect(Collectors.toList());
    }

    private RequestDto accumulator(final RequestDto dto, final RequestDto result) {
        if (Resume.Status.valueOf(dto.getResume().getStatus()) == Resume.Status.CTO_NEED) {
            result.getResumes().add(dto.getResume());
        }
        return result;
    }

    private List<RequestDto> requests(final String template, final String urlTemplate) {
        final String query = resourcesService.loadTemplate(template);
        return jdbcTemplate.query(query, (resultSet, i) -> getRequest(resultSet, urlTemplate));
    }

    private RequestDto getRequest(ResultSet rs, String urlTemplate) {
        final String id = getLong(rs, "id").toString();
        final String url = String.format(urlTemplate, appUrl, id);
        final String company = getString(rs, "company");
        final String name = getString(rs, "name");
        final String status = getString(rs, "status");
        final String priority = getString(rs, "priority");
        final EmployeeDto responsible = getEmployee(rs);
        final ResumeDto resume = getResume(rs);
        final List<ResumeDto> resumes = new ArrayList<>();
        return new RequestDto(id, url, company, name, status, priority, responsible, resume, resumes);
    }

    private EmployeeDto getEmployee(ResultSet rs) {
        final String name = getString(rs, "responsible_name");
        final String login = getString(rs, "login");
        final String email = getString(rs, "email");
        return new EmployeeDto(name, login, email);
    }

    private ResumeDto getResume(ResultSet rs) {
        final Long id = getLong(rs, "resume_id");
        final String fio = getString(rs, "fio");
        final String resumeStatus = getString(rs, "resume_status");
        return id == 0 ? null : new ResumeDto(id, fio, resumeStatus);
    }

    private MessageDto getResumeRequestMessage(final String employeeName, final List<RequestDto> request) {
        return new MessageDto(employeeName, request);
    }
}
