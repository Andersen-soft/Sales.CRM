package com.andersenlab.crm.services.scheduler;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.model.entities.Company;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.model.entities.ResumeRequest;
import com.andersenlab.crm.model.entities.ResumeRequestComment;
import com.andersenlab.crm.publishers.ResumeRequestEventPublisher;
import com.andersenlab.crm.repositories.CompanyRepository;
import com.andersenlab.crm.repositories.EmployeeRepository;
import com.andersenlab.crm.repositories.ResumeRequestRepository;
import com.andersenlab.crm.rest.response.ResumeRequestDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class AutoResponsibleRmScheduler {

    private final ResumeRequestRepository resumeRequestRepository;
    private final ConversionService conversionService;
    private final ResumeRequestEventPublisher resumeRequestEventPublisher;
    private final CompanyRepository companyRepository;
    private final EmployeeRepository employeeRepository;

    //после тестов изменить все значения @Value на не тестовые (т.е. без слова test в начале)
    @Value("${test.time.scheduler.minute}")
    private long timeSchedulerMinute;

    @Value("${test.time.scheduler.hour}")
    private long timeSchedulerHour;

    @Scheduled(cron = "${scheduled.cron30Minute}", zone = "GMT+3")
    @Transactional
    public void autoRedistributionRm() {
        log.debug("auto responsible rm scheduler start");
        List<ResumeRequest> allByStatusChangedDateAfterAndStatus = resumeRequestRepository.findAllByStatusAndIsActiveAndAutoDistribution(ResumeRequest.Status.NAME_NEED, true, true);
        List<ResumeRequest> resumeRequests = checkCreateTaskTime(allByStatusChangedDateAfterAndStatus, timeSchedulerMinute);
        changeResponsibleRmTaskTime(resumeRequests);

    }

    @Scheduled(cron = "${scheduled.cron1Hour}", zone = "GMT+3")
    @Transactional
    public void autoRedistributionOneHour() {
        List<ResumeRequest> allByStatusChangedDateAfterAndStatus =
                resumeRequestRepository.findAllByStatusAndIsActiveAndResponsibleRMAndAutoDistribution(ResumeRequest.Status.NAME_NEED, true, null, true);
        List<ResumeRequest> resumeRequests = checkCreateTaskTime(allByStatusChangedDateAfterAndStatus, timeSchedulerHour);
        closeResponsibleRmTaskTime(resumeRequests);
    }

    private void changeResponsibleRmTaskTime(List<ResumeRequest> resumeRequests) {
        for (ResumeRequest byStatusChangedDateAfterAndStatus : resumeRequests) {
            List<ResumeRequestComment> comments = byStatusChangedDateAfterAndStatus.getComments();
            if (!comments.isEmpty() && byStatusChangedDateAfterAndStatus.getResponsibleRM() != null) {
                long idResponsibleRm = byStatusChangedDateAfterAndStatus.getResponsibleRM().getId();
                boolean commentOwnerIsNotResponsibleRm = comments.stream()
                        .anyMatch(comment -> comment.getEmployee().getId() != idResponsibleRm);
                if (commentOwnerIsNotResponsibleRm) {
                    changeResponsibleRm(byStatusChangedDateAfterAndStatus, null);
                } else {
                    byStatusChangedDateAfterAndStatus.setAutoDistribution(false);
                    checkResponsibleRMAndSetToCompany(byStatusChangedDateAfterAndStatus);
                }
            }
            else if (byStatusChangedDateAfterAndStatus.getResponsibleRM() != null) {
                changeResponsibleRm(byStatusChangedDateAfterAndStatus, null);
            }
        }
    }

    private void checkResponsibleRMAndSetToCompany(ResumeRequest byStatusChangedDateAfterAndStatus) {
        Employee responsibleRm = employeeRepository.getOne(byStatusChangedDateAfterAndStatus.getResponsibleRM().getId());
        if (Boolean.TRUE.equals(responsibleRm.getResponsibleRM())) {
            Company company = companyRepository.findOne(byStatusChangedDateAfterAndStatus.getCompany().getId());
            company.setResponsible(responsibleRm);
            companyRepository.saveAndFlush(company);
        }
    }

    private void closeResponsibleRmTaskTime(List<ResumeRequest> resumeRequests) {
        for (ResumeRequest byStatusChangedDateAfterAndStatus : resumeRequests) {
            Employee firstResponsibleRm = byStatusChangedDateAfterAndStatus.getFirstResponsibleRm();
            byStatusChangedDateAfterAndStatus.setAutoDistribution(false);
            changeResponsibleRm(byStatusChangedDateAfterAndStatus, firstResponsibleRm);
            checkResponsibleRMAndSetToCompany(byStatusChangedDateAfterAndStatus);
        }
    }

    private void changeResponsibleRm(ResumeRequest byStatusChangedDateAfterAndStatus, Employee employee) {
        byStatusChangedDateAfterAndStatus.setResponsibleRM(employee);
        ResumeRequestDto dto = conversionService.convert(byStatusChangedDateAfterAndStatus, ResumeRequestDto.class);
        resumeRequestRepository.saveAndFlush(byStatusChangedDateAfterAndStatus);
        resumeRequestEventPublisher.publishEvent(dto);
    }

    private List<ResumeRequest> checkCreateTaskTime(List<ResumeRequest> source, long minute) {
        List<ResumeRequest> resumeRequests = new ArrayList<>();
        for (ResumeRequest resumeRequest : source) {
            LocalTime timeCreateTask = resumeRequest.getCreateDate().toLocalTime();
            if (differenceTime(timeCreateTask) >= minute) {
                resumeRequests.add(resumeRequest);
            }
        }
        return resumeRequests;

    }

    private long differenceTime(LocalTime time) {
        LocalTime currentTime = LocalTime.now().withSecond(0).withNano(0);
        Duration duration = Duration.between(time, currentTime).abs();
        return duration.getSeconds();

    }
}
