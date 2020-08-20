package com.andersenlab.crm.notification;

import com.andersenlab.crm.configuration.properties.ApplicationProperties;
import com.andersenlab.crm.configuration.properties.SkypeProperties;
import com.andersenlab.crm.events.EstimationRequestCreatedEvent;
import com.andersenlab.crm.events.EstimationRequestStatusChangedEvent;
import com.andersenlab.crm.events.ResumeCreatedEvent;
import com.andersenlab.crm.events.ResumeRequestCreatedEvent;
import com.andersenlab.crm.events.ResumeRequestStatusChangedEvent;
import com.andersenlab.crm.events.ResumeStatusChangedEvent;
import com.andersenlab.crm.model.entities.Company;
import com.andersenlab.crm.model.entities.EstimationRequest;
import com.andersenlab.crm.model.entities.Resume;
import com.andersenlab.crm.model.entities.ResumeRequest;
import com.andersenlab.crm.repositories.EmployeeRepository;
import com.andersenlab.crm.repositories.EstimationRequestRepository;
import com.andersenlab.crm.repositories.ResumeRepository;
import com.andersenlab.crm.repositories.ResumeRequestRepository;
import com.andersenlab.crm.services.impl.SkypeBotSender;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import static com.andersenlab.crm.model.entities.EstimationRequest.Status.APPROVE_NEED;
import static com.andersenlab.crm.model.entities.EstimationRequest.Status.ESTIMATION_NEED;
import static com.andersenlab.crm.model.entities.EstimationRequest.Status.IN_PROGRESS;
import static com.andersenlab.crm.model.entities.ResumeRequest.Status.CTO_NEED;
import static com.andersenlab.crm.utils.SkypeBotHelper.getNullable;
import static com.andersenlab.crm.utils.SkypeBotHelper.getNullableFullName;

@Log4j2
@RequiredArgsConstructor
@Component
public class SkypeNotifier {

    private static final String LINK_TEMPLATE = "<a href='%s%s%d'>%d</a>";

    private final SkypeBotSender skypeBotSender;
    private final ResumeRequestRepository resumeRequestRepository;
    private final EstimationRequestRepository estimationRequestRepository;
    private final ResumeRepository resumeRepository;
    private final EmployeeRepository employeeRepository;

    private final ApplicationProperties applicationProperties;
    private final SkypeProperties skypeProperties;

    @Transactional
    @EventListener(ResumeCreatedEvent.class)
    public void onResumeCreate(ResumeCreatedEvent event) {
        Resume one = resumeRepository.findOne(event.getResumeId());
        resumeStatusChanged(one, one.getStatus());
    }

    @Transactional
    @EventListener(ResumeStatusChangedEvent.class)
    public void onStatusChange(ResumeStatusChangedEvent event) {
        Resume one = resumeRepository.findOne(event.getResumeId());
        resumeStatusChanged(one, event.getNewStatus());
    }

    private void resumeStatusChanged(Resume one, Resume.Status newStatus) {
        ResumeRequest resumeRequest = resumeRequestRepository.findOne(one.getResumeRequest().getId());

        String requestLink = String.format(LINK_TEMPLATE,
                applicationProperties.getUrl(),
                skypeProperties.getUrl().getResumeRequest(),
                resumeRequest.getId(),
                resumeRequest.getId());

        StringBuilder builder = new StringBuilder();
        String requestString = "\r\n".concat(requestLink)
                .concat(getNullable(resumeRequest.getCompany(), Company::getName))
                .concat(" - " + resumeRequest.getName())
                .concat(" - " + one.getFio())
                .concat(" - " + newStatus)
                .concat(getResumeResponsibleString(resumeRequest, one, newStatus));
        builder.append(requestString);

        skypeBotSender.send(skypeProperties.getChat().getCv(), "", builder.toString());
    }

    private String getResumeResponsibleString(
            ResumeRequest request, Resume resume, Resume.Status newStatus) {
        StringBuilder result = new StringBuilder(" - ");
        switch (newStatus) {
            case CTO_NEED:
                if (request.getResponsibleRM() != null) {
                    result.append(getNullableFullName(request.getResponsibleRM()));
                    return result.toString();
                }
                break;
            case IN_PROGRESS:
                if (resume.getResponsibleHr() != null) {
                    result.append(getNullableFullName(resume.getResponsibleHr()));
                    return result.toString();
                }
                break;
            default:
                return "";
        }

        return "";
    }

    @Transactional
    @EventListener(ResumeRequestCreatedEvent.class)
    public void onCreate(ResumeRequestCreatedEvent event) {
        ResumeRequest resumeRequest = resumeRequestRepository.findOne(event.getResumeRequestId());
        resumeRequestStatusChanged(resumeRequest, resumeRequest.getStatus());
    }

    @Transactional
    @EventListener(ResumeRequestStatusChangedEvent.class)
    public void onStatusChange(ResumeRequestStatusChangedEvent event) {
        ResumeRequest resumeRequest = resumeRequestRepository.findOne(event.getResumeRequestId());
        resumeRequestStatusChanged(resumeRequest, event.getNewStatus());
    }

    private void resumeRequestStatusChanged(ResumeRequest resumeRequest, ResumeRequest.Status newStatus) {
        String responsibleRM = "";
        if (newStatus == CTO_NEED && resumeRequest.getResponsibleRM() != null) {
            responsibleRM = " - " + getNullableFullName(resumeRequest.getResponsibleRM());
        }
        String requestLink = String.format(LINK_TEMPLATE,
                applicationProperties.getUrl(),
                skypeProperties.getUrl().getResumeRequest(),
                resumeRequest.getId(),
                resumeRequest.getId());
        String requestString = "\r\n".concat(requestLink)
                .concat(getNullable(resumeRequest.getCompany(), Company::getName))
                .concat(" - " + resumeRequest.getName())
                .concat(" - " + newStatus.getName())
                .concat(responsibleRM)
                .concat(getNullable(resumeRequest.getPriority(), ResumeRequest.Priority::getName));
        skypeBotSender.send(skypeProperties.getChat().getCv(), "", requestString);
    }

    @Transactional
    @EventListener(EstimationRequestCreatedEvent.class)
    public void onStatusChange(EstimationRequestCreatedEvent event) {
        EstimationRequest estimationRequest = estimationRequestRepository.findOne(event.getEstimationRequestId());
        estimationRequestStatusChanged(estimationRequest, estimationRequest.getStatus());
    }

    @Transactional
    @EventListener(EstimationRequestStatusChangedEvent.class)
    public void onStatusChange(EstimationRequestStatusChangedEvent event) {
        EstimationRequest estimationRequest = estimationRequestRepository.findOne(event.getEstimationRequestId());
        estimationRequestStatusChanged(estimationRequest, event.getNewStatus());
    }

    private void estimationRequestStatusChanged(EstimationRequest estimationRequest, EstimationRequest.Status newStatus) {
        String responsible = "";
        if (IN_PROGRESS.equals(newStatus)
                || ESTIMATION_NEED.equals(newStatus)
                && estimationRequest.getResponsibleForRequest() != null) {
            responsible = " - " + getNullableFullName(estimationRequest.getResponsibleForRequest());
        } else if (APPROVE_NEED.equals(newStatus)
                && estimationRequest.getResponsibleRM() != null) {
            responsible = " - " + getNullableFullName(estimationRequest.getResponsibleRM());
        }
        String requestLink = String.format(LINK_TEMPLATE,
                applicationProperties.getUrl(),
                skypeProperties.getUrl().getEstimationRequest(),
                estimationRequest.getId(),
                estimationRequest.getId());
        String message = "\r\n".concat(requestLink)
                .concat(getNullable(estimationRequest.getCompany(), Company::getName))
                .concat(" - " + estimationRequest.getName())
                .concat(getNullable(newStatus, EstimationRequest.Status::getName))
                .concat(responsible);
        skypeBotSender.send(skypeProperties.getChat().getEstimation(), "", message);
    }

}
