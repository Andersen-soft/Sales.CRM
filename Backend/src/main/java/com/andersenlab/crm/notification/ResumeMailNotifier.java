package com.andersenlab.crm.notification;

import com.andersenlab.crm.events.ResumeCommentedEvent;
import com.andersenlab.crm.events.ResumeCreatedEvent;
import com.andersenlab.crm.events.ResumeStatusChangedEvent;
import com.andersenlab.crm.model.Message;
import com.andersenlab.crm.model.RecipientDto;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.model.entities.Resume;
import com.andersenlab.crm.model.entities.ResumeComment;
import com.andersenlab.crm.model.entities.ResumeRequest;
import com.andersenlab.crm.repositories.CommentRepository;
import com.andersenlab.crm.repositories.ResumeRepository;
import com.andersenlab.crm.security.AuthenticatedUser;
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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import static com.andersenlab.crm.notification.ResumeRequestMailNotifier.COMMENT;
import static com.andersenlab.crm.notification.ResumeRequestMailNotifier.EMPTY_COMPANY;
import static com.andersenlab.crm.notification.ResumeRequestMailNotifier.FIO;
import static com.andersenlab.crm.notification.ResumeRequestMailNotifier.FIO_CANDIDATE;
import static com.andersenlab.crm.notification.ResumeRequestMailNotifier.RESUME_REQUEST_URL;
import static com.andersenlab.crm.notification.ResumeRequestMailNotifier.STATUS;
import static com.andersenlab.crm.notification.ResumeRequestMailNotifier.STATUS_AFTER;
import static com.andersenlab.crm.notification.ResumeRequestMailNotifier.STATUS_BEFORE;
import static com.andersenlab.crm.notification.ResumeRequestMailNotifier.SUBJECT_TEMPLATE;
import static com.andersenlab.crm.notification.ResumeRequestMailNotifier.URL_TEMPLATE;

@Log4j2
@RequiredArgsConstructor
@Component
public class ResumeMailNotifier {

    private final ResumeRepository resumeRepository;
    private final AuthenticatedUser authenticatedUser;
    private final MailService mailService;
    private final CommentRepository commentRepository;

    private static final String SUBJECT_TEMPLATE_WITH_STATUS = "%s - %s - %s - CV status \'%s\'";

    @Value("${app.url}")
    private String crmUrl;

    @EventListener(ResumeCommentedEvent.class)
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onComment(ResumeCommentedEvent event) {
        ResumeComment resumeComment = (ResumeComment) commentRepository.getOne(event.getCommentId());
        Resume resume = resumeRepository.findOne(resumeComment.getResume().getId());
        ResumeRequest resumeRequest = resume.getResumeRequest();
        Employee currentUser = authenticatedUser.getCurrentEmployee();
        List<Employee> recipients = recipients(resume, false);
        Set<RecipientDto> recipientEmails = EmailHelper.prepareRecipients(recipients, currentUser);
        Map<String, Object> args = new HashMap<>();
        args.put(FIO_CANDIDATE, resume.getFio());
        args.put(FIO, currentUser.getFirstName() + " " +
                currentUser.getLastName());
        args.put(COMMENT, event.getText());
        args.put("url", String.format(URL_TEMPLATE, crmUrl, RESUME_REQUEST_URL, resumeRequest.getId()));
        mailService.sendMail(recipientEmails, Message.builder()
                .subject(String.format(SUBJECT_TEMPLATE,
                        resumeRequest.getCompany() == null ? EMPTY_COMPANY : resumeRequest.getCompany().getName(),
                        resumeRequest.getId(),
                        resumeRequest.getName()))
                .args(args)
                .template(Message.Template.RESUME_COMMENT_WAS_ADDED)
                .body("")
                .build());
    }

    @EventListener
    @TransactionalEventListener(phase = TransactionPhase.BEFORE_COMMIT, value = ResumeCreatedEvent.class)
    public void onCreate(ResumeCreatedEvent event) {
        Resume resume = resumeRepository.getOne(event.getResumeId());
        ResumeRequest resumeRequest = resume.getResumeRequest();
        Employee currentUser = authenticatedUser.getCurrentEmployee();
        List<Employee> recipients = recipients(resume, true);
        Set<RecipientDto> recipientEmails = EmailHelper.prepareRecipients(recipients, currentUser);
        Map<String, Object> args = new HashMap<>();
        args.put(FIO_CANDIDATE, resume.getFio());
        args.put(FIO, currentUser.getFirstName() + " " +
                currentUser.getLastName());
        args.put(STATUS, resume.getStatus().getName());
        args.put("url", String.format(URL_TEMPLATE, crmUrl, RESUME_REQUEST_URL, resumeRequest.getId()));
        mailService.sendMail(recipientEmails, Message.builder()
                .subject(String.format(SUBJECT_TEMPLATE_WITH_STATUS,
                        resumeRequest.getCompany() == null ? EMPTY_COMPANY : resumeRequest.getCompany().getName(),
                        resumeRequest.getId(),
                        resumeRequest.getName(),
                        resume.getStatus().getName()))
                .args(args)
                .template(Message.Template.RESUME_STATUS_WAS_SET)
                .body("")
                .build());

    }

    @EventListener(ResumeStatusChangedEvent.class)
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @TransactionalEventListener(phase = TransactionPhase.BEFORE_COMMIT, value = ResumeStatusChangedEvent.class)
    public void onStatusChange(ResumeStatusChangedEvent event) {
        Resume resume = resumeRepository.getOne(event.getResumeId());
        ResumeRequest resumeRequest = resume.getResumeRequest();
        Employee currentUser = authenticatedUser.getCurrentEmployee();
        List<Employee> recipients = recipients(resume, true);
        Set<RecipientDto> recipientEmails = EmailHelper.prepareRecipients(recipients, currentUser);
        Map<String, Object> args = new HashMap<>();
        args.put(FIO, currentUser.getFirstName() + " " +
                currentUser.getLastName());
        args.put(FIO_CANDIDATE, resume.getFio());
        args.put(STATUS_BEFORE, resume.getStatus().getName());
        args.put(STATUS_AFTER, event.getNewStatus().getName());
        args.put("url", String.format(URL_TEMPLATE, crmUrl, RESUME_REQUEST_URL, resumeRequest.getId()));
        mailService.sendMail(recipientEmails, Message.builder()
                .subject(String.format(SUBJECT_TEMPLATE_WITH_STATUS,
                        resumeRequest.getCompany() == null ? EMPTY_COMPANY : resumeRequest.getCompany().getName(),
                        resumeRequest.getId(),
                        resumeRequest.getName(),
                        event.getNewStatus().getName()))
                .args(args)
                .template(Message.Template.RESUME_STATUS_WAS_UPDATED)
                .body("")
                .build());
    }

    private List<Employee> recipients(Resume resume, boolean hasResponsibleForSaleRequest) {
        ResumeRequest resumeRequest = resume.getResumeRequest();
        final List<Employee> recipients = new ArrayList<>();
        if (resumeRequest.getResponsibleRM() != null) {
            recipients.add(resumeRequest.getResponsibleRM());
        } else {
            recipients.add(resumeRequest.getCompany().getResponsible());
        }
        recipients.add(resume.getResponsibleHr());
        if (hasResponsibleForSaleRequest) {
            recipients.add(resumeRequest.getResponsibleForSaleRequest());
        }
        return recipients;
    }
}
