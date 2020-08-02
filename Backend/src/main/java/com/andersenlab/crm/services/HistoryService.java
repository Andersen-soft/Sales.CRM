package com.andersenlab.crm.services;

import com.andersenlab.crm.model.entities.CompanySaleHistory;
import com.andersenlab.crm.model.entities.History;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * @author v.pronkin on 31.07.2018
 */

public interface HistoryService {

    Page<History> getEstimationRequestHistory(Long requestId, Pageable pageable);

    List<History> getResumeRequestHistory(Long requestId);

    List<CompanySaleHistory> getCompanySaleHistory(Long saleId);
}