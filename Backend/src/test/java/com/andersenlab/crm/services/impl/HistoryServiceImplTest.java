package com.andersenlab.crm.services.impl;

import com.andersenlab.crm.model.entities.CompanySaleHistory;
import com.andersenlab.crm.model.entities.ResumeHistory;
import com.andersenlab.crm.model.entities.ResumeRequestHistory;
import com.andersenlab.crm.repositories.CompanySaleHistoryRepository;
import com.andersenlab.crm.repositories.EstimationRequestHistoryRepository;
import com.andersenlab.crm.repositories.ResumeHistoryRepository;
import com.andersenlab.crm.repositories.ResumeRequestHistoryRepository;
import org.junit.Test;

import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import java.util.ArrayList;
import java.util.List;

@SuppressWarnings("unchecked")
public class HistoryServiceImplTest {

    private final EstimationRequestHistoryRepository estimationRequestHistoryRepository = mock(EstimationRequestHistoryRepository.class);
    private final ResumeHistoryRepository resumeHistoryRepository = mock(ResumeHistoryRepository.class);
    private final ResumeRequestHistoryRepository resumeRequestHistoryRepository = mock(ResumeRequestHistoryRepository.class);
    private final CompanySaleHistoryRepository companySaleHistoryRepository = mock(CompanySaleHistoryRepository.class);

    private final HistoryServiceImpl historyService = new HistoryServiceImpl(
            estimationRequestHistoryRepository,
            resumeHistoryRepository,
            resumeRequestHistoryRepository,
            companySaleHistoryRepository);

    @Test
    public void whenGetResumeRequestHistoryByEstimationRequestIdThenReturnExpectedResult() {
        List<ResumeRequestHistory> resumeRequestHistories = new ArrayList<>();
        List<ResumeHistory> resumeHistories = new ArrayList<>();

        given(resumeHistoryRepository.findAllResumeHistoryByResumeRequestId(1L))
                .willReturn(resumeHistories);
        given(resumeRequestHistoryRepository.findAllByResumeRequestId(1L))
                .willReturn(resumeRequestHistories);
        historyService.getResumeRequestHistory(1L);

        verify(resumeHistoryRepository, times(1)).findAllResumeHistoryByResumeRequestId(1L);
        verify(resumeRequestHistoryRepository, times(1)).findAllByResumeRequestId(1L);
    }

    @Test
    public void whenGetCompanySaleHistoryByEstimationRequestIdThenReturnExpectedResult() {
        List<CompanySaleHistory> companySaleHistories = new ArrayList<>();

        given(companySaleHistoryRepository.findAllByCompanySaleId(1L))
                .willReturn(companySaleHistories);
        historyService.getCompanySaleHistory(1L);

        verify(companySaleHistoryRepository, times(1)).findAllByCompanySaleId(1L);
    }
}