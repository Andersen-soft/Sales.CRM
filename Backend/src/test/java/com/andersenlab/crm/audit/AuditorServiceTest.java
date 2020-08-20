package com.andersenlab.crm.audit;

import com.andersenlab.crm.aop.audit.AuditorService;
import com.andersenlab.crm.exceptions.CrmException;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.model.entities.ResumeRequest;
import com.andersenlab.crm.repositories.HistoryRepository;
import com.andersenlab.crm.security.AuthenticatedUser;
import org.junit.Before;
import org.junit.Test;

import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

public class AuditorServiceTest {

    private AuthenticatedUser authenticatedUser;
    private AuditorService auditorService;

    @Before
    public void setUp() {
        authenticatedUser = mock(AuthenticatedUser.class);
        HistoryRepository historyRepository = mock(HistoryRepository.class);
        auditorService = new AuditorService(
                authenticatedUser,
                historyRepository
        );
    }

    @Test
    public void whenCreateH() {
        ResumeRequest resumeRequest = new ResumeRequest();
        given(authenticatedUser.getCurrentEmployee()).willReturn(new Employee());

        auditorService.createHistory(resumeRequest);

        verify(authenticatedUser, times(1)).getCurrentEmployee();
    }

    @Test(expected = CrmException.class)
    public void whenCreateHistoryThenReturnCrmException() {
        Object object = new Object();

        auditorService.createHistory(object);
    }
}