package com.andersenlab.crm.listeners;

import com.andersenlab.crm.events.ResumeStatusChangedEvent;
import com.andersenlab.crm.model.entities.Resume;
import com.andersenlab.crm.model.entities.ResumeRequest;
import com.andersenlab.crm.model.entities.SaleObject;
import com.andersenlab.crm.repositories.ResumeRepository;
import com.andersenlab.crm.services.ResumeRequestService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Log4j2
@RequiredArgsConstructor
@Component
public class ResumeStatusListener {

    private final ResumeRequestService resumeRequestService;
    private final ResumeRepository resumeRepository;

    @EventListener(ResumeStatusChangedEvent.class)
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT, value = ResumeStatusChangedEvent.class)
    public void onStatusChange(ResumeStatusChangedEvent event) {
        Resume resume = resumeRepository.getOne(event.getResumeId());
        ResumeRequest resumeRequest = resume.getResumeRequest();
        if (!allResumesHaveStatusPending(resumeRequest)) {
            updateResumeRequestStatus(resumeRequest);
        }
    }

    private void updateResumeRequestStatus(ResumeRequest resumeRequest) {
        if (isAllStatusesDone(resumeRequest)) {
            resumeRequest.setStatus(ResumeRequest.Status.DONE);
            resumeRequestService.update(resumeRequest);
        } else if (isUpdatableResumeRequestStatus(resumeRequest)) {
            resumeRequest.setStatus(ResumeRequest.Status.CTO_NEED);
            resumeRequestService.update(resumeRequest);
        } else if (isContainInProgressResume(resumeRequest)) {
            resumeRequest.setStatus(ResumeRequest.Status.IN_PROGRESS);
            resumeRequestService.update(resumeRequest);
        }
    }

    private boolean allResumesHaveStatusPending(ResumeRequest resumeRequest) {
        return resumeRequest.getResumes().stream()
                .map(Resume::getStatus)
                .allMatch(Resume.Status.PENDING::equals);
    }

    private boolean isUpdatableResumeRequestStatus(ResumeRequest resumeRequest) {
        return resumeRequest != null && resumeRequest.getResumes().stream()
                .filter(SaleObject::getIsActive)
                .map(Resume::getStatus)
                .allMatch(status -> Resume.Status.CTO_NEED.equals(status)
                        || Resume.Status.DONE.equals(status)
                        || Resume.Status.PENDING.equals(status));
    }

    private boolean isAllStatusesDone(ResumeRequest resumeRequest) {
        return resumeRequest != null && resumeRequest.getResumes().stream()
                .filter(SaleObject::getIsActive)
                .map(Resume::getStatus)
                .allMatch(s -> Resume.Status.DONE.equals(s)
                        || Resume.Status.PENDING.equals(s));
    }

    private boolean isContainInProgressResume(ResumeRequest resumeRequest) {
        return resumeRequest != null && resumeRequest.getResumes().stream()
                .filter(SaleObject::getIsActive)
                .map(Resume::getStatus)
                .anyMatch(Resume.Status.IN_PROGRESS::equals);
    }
}
