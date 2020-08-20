package com.andersenlab.crm.notification;

import com.andersenlab.crm.events.EstimationRequestCommentedEvent;
import com.andersenlab.crm.events.EstimationRequestCreatedEvent;
import com.andersenlab.crm.events.EstimationRequestStatusChangedEvent;
import com.andersenlab.crm.model.EventType;
import com.andersenlab.crm.model.Message;
import com.andersenlab.crm.model.RecipientDto;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.model.entities.EstimationRequest;
import com.andersenlab.crm.model.entities.EstimationRequestComment;
import com.andersenlab.crm.repositories.EstimationRequestCommentRepository;
import com.andersenlab.crm.repositories.EstimationRequestRepository;
import com.andersenlab.crm.security.AuthenticatedUser;
import com.andersenlab.crm.services.EmployeeService;
import com.andersenlab.crm.services.MailService;
import com.andersenlab.crm.utils.EmailHelper;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import static com.andersenlab.crm.model.Message.Template.ESTIMATION_REQUEST_CREATED_EN;
import static com.andersenlab.crm.model.Message.Template.ESTIMATION_REQUEST_CREATED_RU;
import static com.andersenlab.crm.notification.ResumeRequestMailNotifier.COMMENT;
import static com.andersenlab.crm.notification.ResumeRequestMailNotifier.EMPTY_COMPANY;
import static com.andersenlab.crm.notification.ResumeRequestMailNotifier.FIO;
import static com.andersenlab.crm.notification.ResumeRequestMailNotifier.STATUS_AFTER;
import static com.andersenlab.crm.notification.ResumeRequestMailNotifier.STATUS_BEFORE;
import static com.andersenlab.crm.notification.ResumeRequestMailNotifier.URL_TEMPLATE;
import static com.andersenlab.crm.services.i18n.I18nConstants.LANGUAGE_TAG_EN;

@Log4j2
@RequiredArgsConstructor
@Component
public class EstimationRequestMailNotifier {
    private static final String URL = "url";
    private static final String COMPANY_SALE_URL = "/sales/";
    private static final String COMMENT_ACTION = "action";
    private static final String COMMENT_CREATE_EN = "has added a new comment";
    private static final String COMMENT_UPDATE_EN = "has changed existing comment";
    private static final String COMMENT_CREATE_RU = "добавил комментарий";
    private static final String COMMENT_UPDATE_RU = "изменил комментарий";

    private static final String SUBJECT_ESTIMATION_REQUEST_CREATED_EN = "New request for estimation";
    private static final String SUBJECT_ESTIMATION_REQUEST_CREATED_RU = "Новый запрос на оценку";
    private static final String SUBJECT_TEMPLATE_WITH_STATUS = "%s - %s - %s - Request for estimation status \'%s\'";
    private static final String SUBJECT_TEMPLATE_WITH_COMMENT = "Comment to %s - %s - %s";

    @Value("${app.url}")
    private String crmUrl;

    @Value("${skype.url.estimationRequest}")
    private String estimationRequestUrl;

    private final EstimationRequestRepository estimationRequestRepository;
    private final EmployeeService employeeService;
    private final AuthenticatedUser authenticatedUser;
    private final MailService mailService;
    private final EstimationRequestCommentRepository estimationRequestCommentRepository;

    @EventListener(EstimationRequestCreatedEvent.class)
    @TransactionalEventListener(phase = TransactionPhase.BEFORE_COMMIT)
    public void onCreate(EstimationRequestCreatedEvent event) {
        EstimationRequest request = estimationRequestRepository.getOne(event.getEstimationRequestId());

        Employee currentEmployee = authenticatedUser.getCurrentEmployee();

        List<Employee> recipients = new LinkedList<>();
        Optional.ofNullable(request.getCompany().getResponsible()).ifPresent(recipients::add);
        Optional.ofNullable(request.getResponsibleForSaleRequest()).ifPresent(recipients::add);

        for (Employee targetEmployee : recipients) {
            if (!targetEmployee.equals(currentEmployee)) {
                String subject;
                Message.Template template;
                if (LANGUAGE_TAG_EN.equalsIgnoreCase(targetEmployee.getEmployeeLang())) {
                    subject = SUBJECT_ESTIMATION_REQUEST_CREATED_EN;
                    template = ESTIMATION_REQUEST_CREATED_EN;
                } else {
                    subject = SUBJECT_ESTIMATION_REQUEST_CREATED_RU;
                    template = ESTIMATION_REQUEST_CREATED_RU;
                }

                Map<String, Object> args = new HashMap<>();
                args.put(FIO, targetEmployee.getFirstName() + " " + targetEmployee.getLastName());
                args.put(URL, String.format(URL_TEMPLATE, crmUrl, estimationRequestUrl, request.getId()));
                args.put("id", request.getId());
                args.put("name", request.getName());
                args.put("companyName", request.getCompany().getName());
                args.put("saleUrl", String.format(URL_TEMPLATE, crmUrl, COMPANY_SALE_URL, request.getCompanySale().getId()));

                Message message = Message.builder()
                        .subject(subject)
                        .args(args)
                        .template(template)
                        .body("")
                        .build();

                RecipientDto recipient = EmailHelper.mapEmployeeToRecipientDto(targetEmployee);
                mailService.sendMail(recipient, message);
            }
        }
    }

    @EventListener
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @TransactionalEventListener(phase = TransactionPhase.BEFORE_COMMIT, value = EstimationRequestStatusChangedEvent.class)
    public void onStatusChange(EstimationRequestStatusChangedEvent event) {
        EstimationRequest request = estimationRequestRepository.getOne(event.getEstimationRequestId());
        Employee currentUser = authenticatedUser.getCurrentEmployee();

        List<Employee> recipients = new LinkedList<>();

        if (request.getResponsibleForRequest() != null) {
            recipients.add(request.getResponsibleForRequest());
        } else {
            recipients.add(request.getCompany().getResponsible());
        }

        Optional.ofNullable(request.getResponsibleForSaleRequest()).ifPresent(recipients::add);

        Set<RecipientDto> recipientDtos = getRecipientsDto(currentUser, recipients);
        Map<String, Object> args = new HashMap<>();
        args.put(FIO, currentUser.getFirstName() + " " +
                currentUser.getLastName());
        args.put(STATUS_BEFORE, request.getStatus().getName());
        args.put(STATUS_AFTER, event.getNewStatus().getName());
        args.put(URL, String.format(URL_TEMPLATE, crmUrl, estimationRequestUrl, request.getId()));
        buildAndSendWithNewStatus(request,
                event.getNewStatus().getName(),
                recipientDtos,
                args,
                Message.Template.ESTIMATION_REQUEST_STATUS_WAS_UPDATED
        );
    }

    @EventListener(EstimationRequestCommentedEvent.class)
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onEstimationRequestCommented(EstimationRequestCommentedEvent event) {
        EstimationRequestComment comment = estimationRequestCommentRepository.getOne(event.getCommentId());
        EstimationRequest request = comment.getEstimationRequest();
        Employee currentUser = authenticatedUser.getCurrentEmployee();

        List<Employee> recipients = new LinkedList<>();

        if (request.getResponsibleForRequest() != null) {
            recipients.add(request.getResponsibleForRequest());
        } else {
            recipients.add(request.getCompany().getResponsible());
        }

        Optional.ofNullable(request.getResponsibleForSaleRequest()).ifPresent(recipients::add);

        Set<RecipientDto> recipientDtos = getRecipientsDto(currentUser, recipients);
        Map<String, Object> args = new HashMap<>();
        args.put(FIO, currentUser.getFirstName() + " " +
                currentUser.getLastName());
        args.put(COMMENT, event.getText());
        if (event.getEventType().equals(EventType.CREATE)) {
            args.put(COMMENT_ACTION, COMMENT_CREATE_EN);
        } else {
            args.put(COMMENT_ACTION, COMMENT_UPDATE_EN);
        }
        args.put(URL, String.format(URL_TEMPLATE, crmUrl, estimationRequestUrl, request.getId()));
        buildAndSendWithComment(request, recipientDtos, args, Message.Template.ESTIMATION_REQUEST_COMMENT_WAS_ADDED_OR_UPDATE);
    }

    private Set<RecipientDto> getRecipientsDto(Employee currentUser, List<Employee> recipients) {
        return recipients.stream()
                .filter(Objects::nonNull)
                .filter(Employee::getIsActive)
                .filter(recipient -> recipient.getEmail() != null)
                .filter(recipient -> !recipient.getEmail().equals(currentUser.getEmail()))
                .map(this::mapEmployeeToRecipientDto)
                .collect(Collectors.toSet());
    }

    private RecipientDto mapEmployeeToRecipientDto(Employee source) {
        return RecipientDto
                .builder()
                .fio(source.getFirstName() + " " + source.getLastName())
                .contact(source.getEmail())
                .build();
    }

    private void buildAndSendWithNewStatus(
            EstimationRequest estimationRequest,
            String newStatus,
            Set<RecipientDto> recipientDtos,
            Map<String, Object> args,
            Message.Template template
    ) {
        mailService.sendMail(recipientDtos, Message.builder()
                .subject(String.format(SUBJECT_TEMPLATE_WITH_STATUS,
                        estimationRequest.getCompany() == null ? EMPTY_COMPANY : estimationRequest.getCompany().getName(),
                        estimationRequest.getId(),
                        estimationRequest.getName(),
                        newStatus))
                .args(args)
                .template(template)
                .body("")
                .build());
    }

    private void buildAndSendWithComment(
            EstimationRequest estimationRequest,
            Set<RecipientDto> recipientDtos,
            Map<String, Object> args,
            Message.Template template
    ) {
        mailService.sendMail(recipientDtos, Message.builder()
                .subject(String.format(SUBJECT_TEMPLATE_WITH_COMMENT,
                        estimationRequest.getCompany() == null ? EMPTY_COMPANY : estimationRequest.getCompany().getName(),
                        estimationRequest.getId(),
                        estimationRequest.getName()))
                .args(args)
                .template(template)
                .body("")
                .build());
    }
}
