package com.andersenlab.crm.audit;

import com.andersenlab.crm.aop.audit.AuditAspect;
import com.andersenlab.crm.aop.audit.AuditHandler;
import com.andersenlab.crm.exceptions.CrmException;
import com.andersenlab.crm.model.entities.Company;
import com.andersenlab.crm.repositories.CompanyRepository;
import lombok.SneakyThrows;
import org.aspectj.lang.ProceedingJoinPoint;
import org.junit.Before;
import org.junit.Test;
import org.springframework.data.repository.CrudRepository;

import java.io.Serializable;

import static org.junit.Assert.assertSame;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

public class AuditAspectTest {

    private AuditHandler auditHandler;
    private AuditAspect auditAspect;
    private ProceedingJoinPoint pjp;
    private CrudRepository repository;

    @Before
    @SuppressWarnings("all")
    public void setUp() {
        auditHandler = mock(AuditHandler.class);
        pjp = mock(ProceedingJoinPoint.class);
        repository = mock(CompanyRepository.class);
        auditAspect = new AuditAspect(
                auditHandler
        );
    }

    @Test
    @SuppressWarnings("all")
    @SneakyThrows
    public void whenInvokeDeleteByIdMethodTheOk() {
        Company obj = new Company();
        Object proceed = pjp.proceed();

        given(auditHandler.isManagedEntity(Company.class)).willReturn(true);
        given(auditHandler.onDelete(obj, pjp)).willReturn(proceed);

        Object resultProceed = auditAspect.delete(pjp, obj, repository);

        assertSame(resultProceed, proceed);
        verify(auditHandler, times(1)).isManagedEntity(Company.class);
        verify(auditHandler, times(1)).onDelete(obj, pjp);
}

    @Test
    @SuppressWarnings("all")
    @SneakyThrows
    public void whenInvokeDeleteByObjectMethodTheOk() {
        Long obj = 1L;
        Object proceed = pjp.proceed();

        given(auditHandler.isManagedEntity(Company.class)).willReturn(true);
        given(auditHandler.onDelete(obj, pjp)).willReturn(proceed);

        Object resultProceed = auditAspect.delete(pjp, obj, repository);

        assertSame(resultProceed, proceed);
        verify(auditHandler, times(1)).isManagedEntity(Company.class);
        verify(auditHandler, times(1))
                .onDelete(repository.findOne((Serializable)obj), pjp);
    }

    @Test(expected = CrmException.class)
    @SuppressWarnings("all")
    public void whenInvokeDeleteMethodThenCrmException() {
        Company obj = new Company();

        given(auditHandler.isManagedEntity(Company.class)).willReturn(true);
        when(auditHandler.onDelete(obj, pjp))
                .thenThrow(new CrmException("Not Audited entity"));

        auditAspect.delete(pjp, obj, repository);

        verify(auditHandler, times(1)).isManagedEntity(Company.class);
        verify(auditHandler, times(1)).onDelete(obj, pjp);
    }

    @Test
    @SneakyThrows
    @SuppressWarnings("all")
    public void whenInvokeSaveOrUpdateWithoutIdMethodThenOk() {
        Company obj = new Company();
        Object proceed = pjp.proceed();

        given(auditHandler.isManagedEntity(Company.class)).willReturn(true);
        given(auditHandler.onSave(pjp)).willReturn(proceed);

        Object resultProceed = auditAspect.saveOrUpdate(pjp, obj, repository);

        assertSame(resultProceed, proceed);
        verify(auditHandler, times(1)).isManagedEntity(Company.class);
        verify(auditHandler, times(1)).onSave(pjp);
    }

    @Test
    @SneakyThrows
    @SuppressWarnings("all")
    public void whenInvokeSaveOrUpdateWithIdMethodThenOk() {
        Company obj = new Company();
        obj.setId(1L);
        Object proceed = pjp.proceed();

        given(auditHandler.isManagedEntity(Company.class)).willReturn(true);
        given(auditHandler.onUpdate(pjp, obj, repository, obj.getId()))
                .willReturn(proceed);

        Object resultProceed = auditAspect.saveOrUpdate(pjp, obj, repository);

        assertSame(resultProceed, proceed);
        verify(auditHandler, times(1)).isManagedEntity(Company.class);
        verify(auditHandler, times(1))
                .onUpdate(pjp, obj, repository, obj.getId());
    }

    @Test(expected = CrmException.class)
    @SuppressWarnings("all")
    public void whenInvokeSaveOrUpdateMethodThenCrmException() {
        Company obj = new Company();

        given(auditHandler.isManagedEntity(Company.class)).willReturn(true);
        given(auditHandler.onSave(pjp))
                .willThrow(new CrmException("Not audited entity"));

        auditAspect.saveOrUpdate(pjp, obj, repository);

        verify(auditHandler, times(1)).isManagedEntity(Company.class);
        verify(auditHandler, times(1)).onSave(pjp);
    }
}