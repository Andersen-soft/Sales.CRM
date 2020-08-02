package com.andersenlab.crm.services.impl;

import com.andersenlab.crm.exceptions.ResourceNotFoundException;
import com.andersenlab.crm.dbtools.dto.ResumeProcessingReport;
import com.andersenlab.crm.model.entities.Resume;
import com.andersenlab.crm.model.entities.ResumeStatusHistory;
import com.andersenlab.crm.model.view.AllResumeRequestsView;
import com.andersenlab.crm.repositories.ResumeRequestViewAllRepository;
import com.andersenlab.crm.repositories.ResumeStatusHistoryRepository;
import com.andersenlab.crm.rest.dto.resumerequest.ResumeProcessingReportRowDTO;
import com.andersenlab.crm.services.Exporter;
import com.andersenlab.crm.services.ResumeRequestViewService;
import com.andersenlab.crm.utils.CrmReportUtils;
import com.querydsl.core.types.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class ResumeRequestViewServiceImpl implements ResumeRequestViewService {

    private final ResumeRequestViewAllRepository resumeRequestViewRepository;
    private final ResumeStatusHistoryRepository resumeStatusHistoryRepository;
    private final Exporter exporter;

    @Override
    public Page<AllResumeRequestsView> get(Predicate predicate, Pageable pageable){
        return resumeRequestViewRepository.findAll(predicate, pageable);
    }

    @Override
    public AllResumeRequestsView get(Long id){
        return getByIdOrThrowException(id);
    }

    private AllResumeRequestsView getByIdOrThrowException(Long id){
        return Optional.ofNullable(resumeRequestViewRepository.findByIsActiveIsTrueAndResumeRequestId(id))
                .orElseThrow(() -> new ResourceNotFoundException("Запрос на резюме с id= " + id + " не существует."));
    }
    
    @Override
    public List<ResumeProcessingReport> getResumeProcessingReports(LocalDate createDateFrom, LocalDate createDateTo) {
        // set bound to current date if "to" parameter is not set
        createDateTo = createDateTo != null ? createDateTo : LocalDate.now();
        return exporter.getResumesForProcessingReport(createDateFrom, createDateTo);
    }

    @Override
    public List<ResumeProcessingReportRowDTO> getResumeProcessingReportRows(LocalDate createDateFrom, LocalDate createDateTo) {
        List<ResumeProcessingReport> reports = getResumeProcessingReports(createDateFrom, createDateTo);
        List<ResumeStatusHistory> statusHistories = resumeStatusHistoryRepository.findAllByResumeIdInOrderByStatusStarted(
                reports.stream()
                .map(ResumeProcessingReport::getResumeId)
                .collect(Collectors.toList()));
        List<ResumeProcessingReportRowDTO> rows = new LinkedList<>();
        long averageDuration = (long)reports.stream()
                .mapToLong(ResumeProcessingReport::getDurationInMinutes)
                .average().orElse(0);

        reports.forEach(r -> getRowsForResumeProcessingReport(r, statusHistories, rows));

        ResumeProcessingReportRowDTO emptyRow = new ResumeProcessingReportRowDTO();
        CrmReportUtils.replaceAllStringNullFields(emptyRow);
        rows.add(emptyRow);

        ResumeProcessingReportRowDTO averageRow = new ResumeProcessingReportRowDTO();
        averageRow.setRequestName("Среднее время обработки резюме");
        averageRow.setDurationHRNeed(convertDurationToString(getAverageDurationForStatus(statusHistories, Resume.Status.HR_NEED.getName())));
        averageRow.setDurationInProgress(convertDurationToString(getAverageDurationForStatus(statusHistories, Resume.Status.IN_PROGRESS.getName())));
        averageRow.setDurationCTONeed(convertDurationToString(getAverageDurationForStatus(statusHistories, Resume.Status.CTO_NEED.getName())));
        averageRow.setDurationDone(convertDurationToString(getAverageDurationForStatus(statusHistories, Resume.Status.DONE.getName())));
        averageRow.setDurationPending(convertDurationToString(getAverageDurationForStatus(statusHistories, Resume.Status.PENDING.getName())));
        averageRow.setDuration(convertDurationToString(averageDuration));
        CrmReportUtils.replaceAllStringNullFields(averageRow);
        rows.add(averageRow);

        return rows;
    }

    private void getRowsForResumeProcessingReport(ResumeProcessingReport resumeProcessingReport,
                                                  List<ResumeStatusHistory> statusHistories,
                                                  List<ResumeProcessingReportRowDTO> rows) {
        List<Long> durationsHRNeed = getDurationsForResumeAndStatus(statusHistories,
                resumeProcessingReport.getResumeId(), Resume.Status.HR_NEED.getName());
        List<Long> durationsInProgress = getDurationsForResumeAndStatus(statusHistories,
                resumeProcessingReport.getResumeId(), Resume.Status.IN_PROGRESS.getName());
        List<Long> durationsCTONeed = getDurationsForResumeAndStatus(statusHistories,
                resumeProcessingReport.getResumeId(), Resume.Status.CTO_NEED.getName());
        List<Long> durationsDone = getDurationsForResumeAndStatus(statusHistories,
                resumeProcessingReport.getResumeId(), Resume.Status.DONE.getName());
        List<Long> durationsPending = getDurationsForResumeAndStatus(statusHistories,
                resumeProcessingReport.getResumeId(), Resume.Status.PENDING.getName());

        int maxSize = Stream.of(durationsHRNeed.size(), durationsInProgress.size(), durationsCTONeed.size(),
                durationsDone.size(), durationsPending.size(),1)
                .max(Integer::compareTo).orElse(1);

        List<String> strHRNeed = convertDurationsToString(durationsHRNeed, maxSize);
        List<String> strInProgress = convertDurationsToString(durationsInProgress, maxSize);
        List<String> strCTONeed = convertDurationsToString(durationsCTONeed, maxSize);
        List<String> strDone = convertDurationsToString(durationsDone, maxSize);
        List<String> strPending = convertDurationsToString(durationsPending, maxSize);

        ResumeProcessingReportRowDTO row = new ResumeProcessingReportRowDTO();
        row.setRequestName(resumeProcessingReport.getRequestName());
        row.setCompanyName(resumeProcessingReport.getCompanyName());
        row.setResponsibleName(resumeProcessingReport.getResponsibleName());
        row.setResponsibleRmName(resumeProcessingReport.getResponsibleRmName());
        row.setResponsibleHrName(resumeProcessingReport.getResponsibleHrName());
        row.setFio(resumeProcessingReport.getFio());
        row.setDurationHRNeed(getDurationFromString(strHRNeed.get(0)));
        row.setAmountHRNeed(getAmount(strHRNeed.get(0), 0));
        row.setDurationInProgress(getDurationFromString(strInProgress.get(0)));
        row.setAmountInProgress(getAmount(strInProgress.get(0), 0));
        row.setDurationCTONeed(getDurationFromString(strCTONeed.get(0)));
        row.setAmountCTONeed(getAmount(strCTONeed.get(0), 0));
        row.setDurationDone(getDurationFromString(strDone.get(0)));
        row.setAmountDone(getAmount(strDone.get(0), 0));
        row.setDurationPending(getDurationFromString(strPending.get(0)));
        row.setAmountPending(getAmount(strPending.get(0), 0));
        row.setDuration(convertDurationToString(resumeProcessingReport.getDurationInMinutes()));
        rows.add(row);

        for (int i = 1; i < maxSize; i++) {
            row = new ResumeProcessingReportRowDTO();
            row.setDurationHRNeed(getDurationFromString(strHRNeed.get(i)));
            row.setAmountHRNeed(getAmount(strHRNeed.get(i), i));
            row.setDurationInProgress(getDurationFromString(strInProgress.get(i)));
            row.setAmountInProgress(getAmount(strInProgress.get(i), i));
            row.setDurationCTONeed(getDurationFromString(strCTONeed.get(i)));
            row.setAmountCTONeed(getAmount(strCTONeed.get(i), i));
            row.setDurationDone(getDurationFromString(strDone.get(i)));
            row.setAmountDone(getAmount(strDone.get(i), i));
            row.setDurationPending(getDurationFromString(strPending.get(i)));
            row.setAmountPending(getAmount(strPending.get(i), i));
            CrmReportUtils.replaceAllStringNullFields(row);
            rows.add(row);
        }


    }

    private List<Long> getDurationsForResumeAndStatus(List<ResumeStatusHistory> statusHistories, Long resumeId, String statusName) {
        return statusHistories.stream()
                .filter(s -> s.getResume().getId().equals(resumeId) && s.getStatusName().equals(statusName))
                .map(ResumeStatusHistory::getStatusDuration)
                .collect(Collectors.toList());
    }

    private List<String> convertDurationsToString(List<Long> durations, int maxSize){
        List<String> durationsString = new ArrayList<>();
        if (durations.isEmpty()) {
            durationsString.add("");
        } else {
            durations.forEach(d -> durationsString.add(convertDurationSecondToString(d)));
        }
        int max = maxSize - durations.size();
        for (int i = 0; i < max; i++){
            durationsString.add("");
        }
        return durationsString;
    }

    private String convertDurationToString(Long durationInMinutes) {

        long hours = durationInMinutes / 60;
        long minutes = durationInMinutes % 60;
        StringBuilder builder = new StringBuilder();

        if (hours > 0) {
            builder.append(hours).append(' ').append('ч');
        }

        if (minutes > 0) {
            if (builder.length() > 0) {
                builder.append(' ');
            }
            builder.append(minutes).append(' ').append("мин");
        }
        return builder.toString();
    }

    private String convertDurationSecondToString(Long second) {
        if (second == null) {
            return "current";
        }
        if (second == 0) {
            return convertDurationToString(second);
        } else {
            long minutes = second / 60;
            return second < 60 ? convertDurationToString(1L) : convertDurationToString(minutes);
        }
    }

    private String getAmount(String duration, int i) {
        return "".equals(duration) ? "" : i + 1 + "";
    }

    private long getAverageDurationForStatus(List<ResumeStatusHistory> statusHistories, String statusName) {
        OptionalDouble average = statusHistories.stream()
                .filter(s -> s.getStatusName().equals(statusName) && s.getStatusDuration() != null)
                .mapToLong(ResumeStatusHistory::getStatusDuration)
                .average();
        if (average.isPresent()) {
            Double averageMinutes = average.getAsDouble()/60;
            long round = Math.round(averageMinutes);
            return round == 0 ? 1 : round;
        } else {
            return 0;
        }
    }

    private String getDurationFromString(String duration){
        return "current".equals(duration) ? "" : duration;
    }

}
