package com.andersenlab.crm.services.impl;

import com.andersenlab.crm.model.entities.CompanySale;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.model.entities.EstimationRequest;
import com.andersenlab.crm.model.entities.QEstimationRequest;
import com.andersenlab.crm.model.entities.QResumeRequest;
import com.andersenlab.crm.model.entities.ResumeRequest;
import com.andersenlab.crm.repositories.EstimationRequestRepository;
import com.andersenlab.crm.repositories.ResumeRequestRepository;
import com.andersenlab.crm.services.SaleRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SaleRequestServiceImpl implements SaleRequestService {
    private final ResumeRequestRepository resumeRequestRepository;
    private final EstimationRequestRepository estimationRequestRepository;

    @Override
    @Transactional
    public void assignResponsibleForAllRequestsByCompanySale(CompanySale companySale, Employee responsible) {
        List<ResumeRequest> resumeRequests = new ArrayList<>();
        resumeRequestRepository.findAll(QResumeRequest.resumeRequest.companySale.id.eq(companySale.getId()))
                .forEach(resumeRequests::add);
        resumeRequests.forEach(request -> request.setResponsibleForSaleRequest(responsible));

        List<EstimationRequest> estimationRequests = new ArrayList<>();
        estimationRequestRepository.findAll(QEstimationRequest.estimationRequest.companySale.id.eq(companySale.getId()))
                .forEach(estimationRequests::add);
        estimationRequests.forEach(request -> request.setResponsibleForSaleRequest(responsible));
    }
}
