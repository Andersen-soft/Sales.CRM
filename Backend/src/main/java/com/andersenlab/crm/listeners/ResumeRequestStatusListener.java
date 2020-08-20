package com.andersenlab.crm.listeners;

import com.andersenlab.crm.events.ResumeRequestStatusChangedEvent;
import com.andersenlab.crm.model.entities.Resume;
import com.andersenlab.crm.model.entities.ResumeRequest;
import com.andersenlab.crm.model.entities.SaleObject;
import com.andersenlab.crm.repositories.ResumeRequestRepository;
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
public class ResumeRequestStatusListener {

    private final ResumeRequestRepository resumeRequestRepository;
    private final ResumeRequestService resumeRequestService;

    @EventListener(ResumeRequestStatusChangedEvent.class)
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT, value = ResumeRequestStatusChangedEvent.class)
    public void onStatusChange(ResumeRequestStatusChangedEvent event) {
        ResumeRequest resumeRequest = resumeRequestRepository.findOne(event.getResumeRequestId());
        if (event.getNewStatus().equals(ResumeRequest.Status.DONE)
                && isUpdatableResumeRequestStatus(resumeRequest)) {
            resumeRequest.getResumes().forEach(resume -> resume.setStatus(Resume.Status.DONE));
            resumeRequestService.update(resumeRequest);
        }
    }

    private boolean isUpdatableResumeRequestStatus(ResumeRequest resumeRequest){
        return resumeRequest != null && resumeRequest.getResumes().stream()
                .filter(SaleObject::getIsActive)
                .map(Resume::getStatus)
                .noneMatch(status -> Resume.Status.IN_PROGRESS.equals(status)
                        || Resume.Status.PENDING.equals(status)
                        || Resume.Status.HR_NEED.equals(status));
    }
}
