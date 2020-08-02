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
import org.junit.Before;
import org.junit.Test;

import java.util.Collections;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class SaleRequestServiceTest {
    private ResumeRequestRepository resumeRequestRepository = mock(ResumeRequestRepository.class);
    private EstimationRequestRepository estimationRequestRepository = mock(EstimationRequestRepository.class);

    private SaleRequestService saleRequestService = new SaleRequestServiceImpl(
            resumeRequestRepository,
            estimationRequestRepository
    );

    private CompanySale companySale;
    private ResumeRequest resumeRequest;
    private EstimationRequest estimationRequest;

    @Before
    public void setUpEntities() {
        Employee employee = new Employee();
        employee.setId(1L);
        employee.setIsActive(true);
        employee.setLogin("login");

        companySale = new CompanySale();
        companySale.setId(1L);
        companySale.setIsActive(true);
        companySale.setResponsible(employee);

        resumeRequest = new ResumeRequest();
        resumeRequest.setId(1L);
        resumeRequest.setIsActive(true);
        resumeRequest.setResponsibleForSaleRequest(employee);
        resumeRequest.setCompanySale(companySale);

        when(resumeRequestRepository.findAll(QResumeRequest.resumeRequest.companySale.id.eq(companySale.getId())))
                .thenReturn(Collections.singletonList(resumeRequest));

        estimationRequest = new EstimationRequest();
        estimationRequest.setId(2L);
        estimationRequest.setIsActive(true);
        estimationRequest.setResponsibleForSaleRequest(employee);
        estimationRequest.setCompanySale(companySale);

        when(estimationRequestRepository.findAll(QEstimationRequest.estimationRequest.companySale.id.eq(companySale.getId())))
                .thenReturn(Collections.singletonList(estimationRequest));
    }

    @Test
    public void whenAssignResponsibleThenSuccess() {
        Employee newResponsible = new Employee();
        newResponsible.setId(2L);
        newResponsible.setIsActive(true);
        newResponsible.setLogin("the one and only");

        ResumeRequest expectedResumeRequest = new ResumeRequest();
        expectedResumeRequest.setId(1L);
        expectedResumeRequest.setIsActive(true);
        expectedResumeRequest.setResponsibleForSaleRequest(newResponsible);
        expectedResumeRequest.setCompanySale(companySale);

        EstimationRequest expectedEstimationRequest = new EstimationRequest();
        expectedEstimationRequest.setId(2L);
        expectedEstimationRequest.setIsActive(true);
        expectedEstimationRequest.setResponsibleForSaleRequest(newResponsible);
        expectedEstimationRequest.setCompanySale(companySale);

        saleRequestService.assignResponsibleForAllRequestsByCompanySale(companySale, newResponsible);

        assertEquals(expectedResumeRequest, resumeRequest);
        assertEquals(expectedEstimationRequest, estimationRequest);
    }
}
