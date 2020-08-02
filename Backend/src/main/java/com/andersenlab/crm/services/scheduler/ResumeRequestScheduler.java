package com.andersenlab.crm.services.scheduler;

import com.andersenlab.crm.model.entities.ResumeRequest;
import com.andersenlab.crm.model.entities.ResumeRequestView;
import com.andersenlab.crm.repositories.ResumeRequestRepository;
import com.andersenlab.crm.repositories.ResumeRequestViewRepository;
import lombok.AllArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
@AllArgsConstructor
public class ResumeRequestScheduler {

    private final ResumeRequestRepository requestRepository;
    private final ResumeRequestViewRepository viewRepository;

    @Scheduled(cron = "0 0 0 ? * *")
    public void checkResumeRequestActivity() {
        List<ResumeRequestView> views = viewRepository.findAll();
        views.stream()
                .filter(ResumeRequestView::getIsActive)
                .filter(view -> view.getStatus().equals(ResumeRequestView.BoardStatus.DONE))
                .filter(this::checkDoneDate)
                .forEach(this::archiveNotActive);
    }

    private void archiveNotActive(ResumeRequestView view) {
        ResumeRequest resumeRequest = view.getResumeRequest();
        resumeRequest.setIsActive(false);
        requestRepository.saveAndFlush(resumeRequest);
    }

    private boolean checkDoneDate(ResumeRequestView view) {
        ResumeRequest resumeRequest = view.getResumeRequest();
        LocalDate doneDate = resumeRequest.getDoneDate().toLocalDate();
        LocalDate realDate = LocalDateTime.now().toLocalDate();
        return doneDate.isBefore(realDate.minusDays(1));
    }
}
