package com.andersenlab.crm.services.impl;

import com.andersenlab.crm.model.entities.CompanySaleHistory;
import com.andersenlab.crm.model.entities.History;
import com.andersenlab.crm.repositories.CompanySaleHistoryRepository;
import com.andersenlab.crm.repositories.EstimationRequestHistoryRepository;
import com.andersenlab.crm.repositories.ResumeHistoryRepository;
import com.andersenlab.crm.repositories.ResumeRequestHistoryRepository;
import com.andersenlab.crm.services.HistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HistoryServiceImpl implements HistoryService {

    private final EstimationRequestHistoryRepository estimationRequestHistoryRepository;
    private final ResumeHistoryRepository resumeHistoryRepository;
    private final ResumeRequestHistoryRepository resumeRequestHistoryRepository;
    private final CompanySaleHistoryRepository companySaleHistoryRepository;

    @Override
    public Page<History> getEstimationRequestHistory(Long requestId, Pageable pageable) {
        return estimationRequestHistoryRepository.findAllByEstimationRequestId(requestId, pageable);
    }

    @Override
    public List<History> getResumeRequestHistory(Long requestId) {
        List<History> histories = new ArrayList<>();
        histories.addAll(resumeRequestHistoryRepository.findAllByResumeRequestId(requestId));
        histories.addAll(resumeHistoryRepository.findAllResumeHistoryByResumeRequestId(requestId));
        return sortHistory(histories);
    }

    @Override
    public List<CompanySaleHistory> getCompanySaleHistory(Long saleId) {
        List<CompanySaleHistory> histories = companySaleHistoryRepository.findAllByCompanySaleId(saleId);
        return sortHistory(histories);
    }

    private <T extends History> List<T> sortHistory(List<T> histories) {
        histories.sort(Comparator.comparing(History::getCreateDate));
        return histories;
    }
}
