package com.andersenlab.crm.notification;

import com.andersenlab.crm.events.ResumeRequestCommentedEvent;
import com.andersenlab.crm.events.ResumeRequestCreatedEventNew;
import com.andersenlab.crm.events.ResumeRequestEvent;
import com.andersenlab.crm.events.ResumeRequestStatusChangedEvent;
import com.andersenlab.crm.model.EventType;
import com.andersenlab.crm.model.Message;
import com.andersenlab.crm.model.RecipientDto;
import com.andersenlab.crm.model.RoleEnum;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.model.entities.QEmployee;
import com.andersenlab.crm.model.entities.Resume;
import com.andersenlab.crm.model.entities.ResumeRequest;
import com.andersenlab.crm.model.entities.ResumeRequestComment;
import com.andersenlab.crm.repositories.EmployeeRepository;
import com.andersenlab.crm.repositories.ResumeRequestCommentRepository;
import com.andersenlab.crm.repositories.ResumeRequestRepository;
import com.andersenlab.crm.rest.response.ResumeRequestDto;
import com.andersenlab.crm.security.AuthenticatedUser;
import com.andersenlab.crm.services.EmployeeService;
import com.andersenlab.crm.services.MailService;
import com.andersenlab.crm.utils.EmailHelper;
import com.querydsl.core.types.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.util.ObjectUtils;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

import static com.andersenlab.crm.model.Message.Template.RESUME_REQUEST_CREATED_EN;
import static com.andersenlab.crm.model.Message.Template.RESUME_REQUEST_CREATED_RU;
import static com.andersenlab.crm.model.RoleEnum.ROLE_HR;
import static com.andersenlab.crm.model.RoleEnum.ROLE_RM;
import static com.andersenlab.crm.model.entities.ResumeRequest.Status.CTO_NEED;
import static com.andersenlab.crm.model.entities.ResumeRequest.Status.DONE;
import static com.andersenlab.crm.model.entities.ResumeRequest.Status.HR_NEED;
import static com.andersenlab.crm.model.entities.ResumeRequest.Status.NAME_NEED;
import static com.andersenlab.crm.model.entities.ResumeRequest.Status.PENDING;
import static com.andersenlab.crm.services.i18n.I18nConstants.LANGUAGE_TAG_EN;

@Log4j2
@RequiredArgsConstructor
@Component
public class ResumeRequestMailNotifier {
    public static final String COMPANY = "company";
    static final String FIO = "fio";
    static final String FIO_CANDIDATE = "fioCandidate";
    static final String COMMENT = "comment";
    private static final String URL = "url";
    public static final String STATUS = "status";
    static final String STATUS_AFTER = "statusAfter";
    static final String STATUS_BEFORE = "statusBefore";
    static final String EMPTY_COMPANY = "Компания не указана";
    static final String RESUME_REQUEST_URL = "/resume-requests/";
    static final String SUBJECT_TEMPLATE = "%s - %s - %s";
    private static final String SUBJECT_TEMPLATE_WITH_STATUS = "%s - %s - %s - request for CV status \'%s\'";
    private static final String SUBJECT_TEMPLATE_WITH_COMMENT = "Comment to %s - %s - %s";
    static final String URL_TEMPLATE = "%s%s%d";
    private static final String COMMENT_ACTION = "action";
    private static final String COMMENT_CREATE_EN = "has added a new comment";
    private static final String COMMENT_UPDATE_EN = "has changed existing comment";
    private static final String COMMENT_CREATE_RU = "добавил комментарий";
    private static final String COMMENT_UPDATE_RU = "изменил комментарий";
    private static final String USER_NAME = "userName";
    private static final String ID_REQUEST = "idRequest";
    private static final String NAME_REQUEST = "nameRequest";
    private static final String TOPIC_MESSAGE_RU = "Распределение запросов на резюме";
    private static final String TOPIC_MESSAGE_EN = "Assignment of requests for CV";

    private static final String SALE_URL_TEMPLATE = "%s/sales/%d";
    private static final String REQUEST_URL = "requestUrl";
    private static final String REQUEST_URL_TEMPLATE = "%s/resume-requests/%d";
    private static final String EMPLOYEE_NAME_TEMPLATE = "%s %s";

    private static final String SUBJECT_ON_RESUME_REQUEST_CREATED_RU = "Новый запрос на резюме";
    private static final String SUBJECT_ON_RESUME_REQUEST_CREATED_EN = "New request for CV";

    @Value("${app.url}")
    private String crmUrl;

    private final EmployeeService employeeService;
    private final ResumeRequestRepository resumeRequestRepository;
    private final EmployeeRepository employeeRepository;
    private final AuthenticatedUser authenticatedUser;
    private final MailService mailService;
    private final ResumeRequestCommentRepository resumeRequestCommentRepository;

    @EventListener(ResumeRequestCreatedEventNew.class)
    public void onResumeRequestCreated(ResumeRequestCreatedEventNew event) {
        ResumeRequest resumeRequest = event.getCreatedRequest();
        Employee currentUser = authenticatedUser.getCurrentEmployee();

        List<Employee> recipients = Stream.of(resumeRequest.getResponsibleRM(), resumeRequest.getCompany().getResponsible())
                .filter(Objects::nonNull)
                .distinct()
                .collect(Collectors.toList());

        for (Employee recipient : recipients) {
            if (!recipient.equals(currentUser)) {
                Map<String, Object> modelMap = new HashMap<>();
                modelMap.put(FIO, String.format(EMPLOYEE_NAME_TEMPLATE,
                        recipient.getFirstName(), recipient.getLastName()));
                modelMap.put(URL, String.format(SALE_URL_TEMPLATE,
                        crmUrl, resumeRequest.getCompanySale().getId()));
                modelMap.put(ID_REQUEST, resumeRequest.getId());
                modelMap.put(NAME_REQUEST, resumeRequest.getName());
                modelMap.put(REQUEST_URL, String.format(REQUEST_URL_TEMPLATE,
                        crmUrl, resumeRequest.getId()));
                modelMap.put(COMPANY, resumeRequest.getCompanySale().getCompany().getName());

                String subject;
                Message.Template template;
                if (LANGUAGE_TAG_EN.equalsIgnoreCase(recipient.getEmployeeLang())) {
                    subject = SUBJECT_ON_RESUME_REQUEST_CREATED_EN;
                    template = RESUME_REQUEST_CREATED_EN;
                } else {
                    subject = SUBJECT_ON_RESUME_REQUEST_CREATED_RU;
                    template = RESUME_REQUEST_CREATED_RU;
                }

                RecipientDto recipientDto = EmailHelper.mapEmployeeToRecipientDto(recipient);

                mailService.sendMail(recipientDto, Message.builder()
                        .subject(subject)
                        .args(modelMap)
                        .template(template)
                        .body("")
                        .build());
            }
        }
    }

    @Transactional
    public void onResponsibleRmChanged(ResumeRequestEvent event) {
        ResumeRequestDto resumeRequestDto = event.getDto();
        ResumeRequest resumeRequest = resumeRequestRepository.getOne(resumeRequestDto.getId());
        Employee currentUser = employeeRepository.getOne(resumeRequestDto.getResponsibleForSaleRequest().getId());
        List<Employee> recipients = new LinkedList<>();
        Employee responsibleRm = null;

        //Ожидаем с запроса ответственного
        //Null если в системе нет ответственных учавствующих в распределнии или через 30 мин мы сбрасываем RM
        if (resumeRequestDto.getResponsible() != null) {
            responsibleRm = employeeRepository.getOne(resumeRequestDto.getResponsible().getId());
        }
        //Если есть ответсвенный - мы добавляем в получатели писем
        if (responsibleRm != null) {
            recipients.add(responsibleRm);
            autoDistributionRmEmailNotifier(resumeRequestDto, resumeRequest, currentUser, recipients, responsibleRm);
            //Учавствует ли запрос в распределнии
        } else if (resumeRequestDto.isAutoDistribution()) {
            List<Employee> listRMs = getEmployeesByRole(ROLE_RM, true);
            recipients.addAll(listRMs);
            autoDistributionRmEmailNotifier(resumeRequestDto, resumeRequest, currentUser, recipients, null);
        }
        //Если в системе нет ресурсных с флагом распределения
        else {
            List<Employee> listRMs = getEmployeesByRole(ROLE_RM, false);
            recipients.addAll(listRMs);
            Set<RecipientDto> recipientDtos = EmailHelper.prepareRecipients(recipients, currentUser);
            notAutoDistributionRmEmailNotifier(resumeRequest, currentUser, recipientDtos);
        }
    }

    /**
     * Email notifier only for auto distribution
     *
     * @param resumeRequestDto Response for front
     * @param resumeRequest    Entity ResumeRequest
     * @param currentUser      Employee
     * @param recipients       email notification recipients
     */
    private void autoDistributionRmEmailNotifier(ResumeRequestDto resumeRequestDto,
                                                 ResumeRequest resumeRequest,
                                                 Employee currentUser,
                                                 List<Employee> recipients,
                                                 Employee responsibleRm) {
        Set<RecipientDto> recipientDtos = EmailHelper.prepareRecipients(recipients, currentUser);
        Map<String, Object> args = new HashMap<>();
        args.put(ID_REQUEST, resumeRequest.getId());
        args.put(NAME_REQUEST, resumeRequest.getName());
        args.put(URL, String.format(URL_TEMPLATE, crmUrl, RESUME_REQUEST_URL, resumeRequest.getId()));
        for (RecipientDto recipientDto : recipientDtos) {
            args.put(USER_NAME, recipientDto.getFio());

            //Отправляем сообщение на почту если RM не подтвердил (30 мин)
            if (!ObjectUtils.isEmpty(recipientDtos) && responsibleRm == null) {
                sendMessage(recipientDto, args, Message.Template.RESUME_REQUEST_AUTO_DISTRIBUTION_NO_COMMENT);

                //Если ниодин из RM не взял в работу (1 час после первого условия)
            } else if (!resumeRequestDto.isAutoDistribution()) {
                sendMessage(recipientDto, args, Message.Template.RESUME_REQUEST_AUTO_DISTRIBUTION_NO_COMMENT_HOUR);

                //Если RM с флагом и запрос назначился на него(Создался запрос и распределился
                // (в запросе есть ответственный, нет коммента ответственного и запрос в распределении))
            } else {
                sendMessage(recipientDto, args, Message.Template.RESUME_REQUEST_AUTO_DISTRIBUTION);
            }
            //Нет условия по которому только 1 RM с флагом то не отправится писмо NO_COMMENT
        }
    }

    private void notAutoDistributionRmEmailNotifier(ResumeRequest resumeRequest, Employee currentUser, Set<RecipientDto> recipientDtos) {
        Map<String, Object> args2 = new HashMap<>();
        args2.put(FIO, currentUser.getFirstName() + " " +
                currentUser.getLastName());
        args2.put(URL, String.format(URL_TEMPLATE, crmUrl, RESUME_REQUEST_URL, resumeRequest.getId()));
        buildAndSendWithNewStatus(
                resumeRequest,
                resumeRequest.getStatus().getName(),
                recipientDtos,
                args2,
                Message.Template.RESUME_REQUEST_STATUS_WAS_SET
        );
    }

    private void sendMessage(RecipientDto recipientDto, Map<String, Object> args, Message.Template resumeRequestAutoDistributionNoComment) {
        mailService.sendMail(recipientDto, Message.builder()
                .subject(TOPIC_MESSAGE_EN)
                .args(args)
                .template(resumeRequestAutoDistributionNoComment)
                .body("")
                .build());
    }

    private List<Employee> getEmployeesByRole(RoleEnum role, boolean rm) {
        Predicate employersFilter = QEmployee.employee.roles.any().name.eq(role)
                .and(QEmployee.employee.isActive.eq(true)).and(QEmployee.employee.responsibleRM.eq(rm));
        return StreamSupport.stream(employeeRepository.findAll(employersFilter).spliterator(), false)
                .collect(Collectors.toList());
    }

    @EventListener
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @TransactionalEventListener(phase = TransactionPhase.BEFORE_COMMIT, value = ResumeRequestStatusChangedEvent.class)
    public void onStatusChange(ResumeRequestStatusChangedEvent event) {
        ResumeRequest resumeRequest = resumeRequestRepository.getOne(event.getResumeRequestId());
        Employee currentUser = authenticatedUser.getCurrentEmployee();
        List<Employee> recipients = getRecipients(event, resumeRequest);
        Set<RecipientDto> recipientDtos = EmailHelper.prepareRecipients(recipients, currentUser);
        Map<String, Object> args = new HashMap<>();
        args.put(FIO, currentUser.getFirstName() + " " +
                currentUser.getLastName());
        args.put(STATUS_BEFORE, resumeRequest.getStatus().getName());
        args.put(STATUS_AFTER, event.getNewStatus().getName());
        args.put(URL, String.format(URL_TEMPLATE, crmUrl, RESUME_REQUEST_URL, resumeRequest.getId()));
        buildAndSendWithNewStatus(
                resumeRequest,
                event.getNewStatus().getName(),
                recipientDtos,
                args,
                Message.Template.RESUME_REQUEST_STATUS_WAS_UPDATED
        );
    }

    private List<Employee> getRecipients(ResumeRequestStatusChangedEvent event, ResumeRequest resumeRequest) {
        List<Employee> recipients = new LinkedList<>();
        if (DONE.equals(event.getNewStatus()) || PENDING.equals(event.getNewStatus())) {
            recipients.add(resumeRequest.getResponsibleForSaleRequest());
            if (resumeRequest.getResponsibleRM() != null) {
                recipients.add(resumeRequest.getResponsibleRM());
            } else {
                recipients.add(resumeRequest.getCompany().getResponsible());
            }
        }

        if (CTO_NEED.equals(event.getNewStatus()) || NAME_NEED.equals(event.getNewStatus())) {
            recipients.add(resumeRequest.getResponsibleForSaleRequest());
            if (resumeRequest.getResponsibleRM() != null) {
                recipients.add(resumeRequest.getResponsibleRM());
            } else {
                recipients.add(resumeRequest.getCompany().getResponsible());
            }
        }

        if (HR_NEED.equals(event.getNewStatus())) {
            // Добавляем в получатели ответственного по запросу
            recipients.add(resumeRequest.getResponsibleForSaleRequest());
            // Берем всех ответственных HR из резюме в запросе
            List<Employee> responsibleHrs = resumeRequest.getResumes().stream()
                    .filter(Resume::getIsActive)
                    .map(Resume::getResponsibleHr)
                    .collect(Collectors.toList());
            // Если HRs есть добавляем их в получателей
            if (!responsibleHrs.isEmpty()) {
                recipients.addAll(responsibleHrs);
                // Иначе собираем всех HRов и шлем им письмо
            } else {
                recipients.addAll(employeeService.getEmployeesByRole(ROLE_HR));
            }
        }
        return recipients;
    }

    @EventListener(ResumeRequestCommentedEvent.class)
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onCreteOrUpdateComment(ResumeRequestCommentedEvent event) {
        ResumeRequestComment resumeRequestComment = resumeRequestCommentRepository.getOne(event.getCommentId());
        ResumeRequest resumeRequest = resumeRequestComment.getResumeRequest();
        Employee currentUser = authenticatedUser.getCurrentEmployee();
        List<Employee> recipients = new LinkedList<>();

        if (resumeRequest.getResponsibleRM() != null) {
            recipients.add(resumeRequest.getResponsibleRM());
        } else {
            recipients.add(resumeRequest.getCompany().getResponsible());
        }
        recipients.add(resumeRequest.getResponsibleForSaleRequest());
        List<Employee> responsibleHrs = resumeRequest.getResumes().stream()
                .filter(Resume::getIsActive)
                .map(Resume::getResponsibleHr)
                .collect(Collectors.toList());
        recipients.addAll(responsibleHrs);
        Set<RecipientDto> recipientDtos = EmailHelper.prepareRecipients(recipients, currentUser);
        Map<String, Object> args = new HashMap<>();
        args.put(FIO, currentUser.getFirstName() + " " +
                currentUser.getLastName());
        args.put(COMMENT, event.getText());
        if (event.getEventType().equals(EventType.CREATE)) {
            args.put(COMMENT_ACTION, COMMENT_CREATE_EN);
        } else {
            args.put(COMMENT_ACTION, COMMENT_UPDATE_EN);
        }
        args.put(URL, String.format(URL_TEMPLATE, crmUrl, RESUME_REQUEST_URL, resumeRequest.getId()));
        buildAndSendWithComment(
                resumeRequest,
                recipientDtos,
                args,
                Message.Template.RESUME_REQUEST_COMMENT_WAS_ADDED_OR_UPDATE
        );

    }

    private void buildAndSendWithNewStatus(
            ResumeRequest resumeRequest,
            String newStatus,
            Set<RecipientDto> recipientDtos,
            Map<String, Object> args,
            Message.Template resumeRequestCommentWasAdded
    ) {
        mailService.sendMail(recipientDtos, Message.builder()
                .subject(String.format(SUBJECT_TEMPLATE_WITH_STATUS,
                        resumeRequest.getCompany() == null ? EMPTY_COMPANY : resumeRequest.getCompany().getName(),
                        resumeRequest.getId(),
                        resumeRequest.getName(),
                        newStatus))
                .args(args)
                .template(resumeRequestCommentWasAdded)
                .body("")
                .build());
    }

    private void buildAndSendWithComment(
            ResumeRequest resumeRequest,
            Set<RecipientDto> recipientDtos,
            Map<String, Object> args,
            Message.Template resumeRequestCommentWasAdded
    ) {
        mailService.sendMail(recipientDtos, Message.builder()
                .subject(String.format(SUBJECT_TEMPLATE_WITH_COMMENT,
                        resumeRequest.getCompany() == null ? EMPTY_COMPANY : resumeRequest.getCompany().getName(),
                        resumeRequest.getId(),
                        resumeRequest.getName()))
                .args(args)
                .template(resumeRequestCommentWasAdded)
                .body("")
                .build());
    }
}
