package com.andersenlab.crm.audit;

import com.andersenlab.crm.aop.audit.AuditHandler;
import com.andersenlab.crm.aop.audit.AuditorService;
import com.andersenlab.crm.model.entities.Company;
import com.andersenlab.crm.repositories.CompanyRepository;
import lombok.SneakyThrows;
import org.aspectj.lang.ProceedingJoinPoint;
import org.junit.Before;
import org.junit.Test;
import org.mockito.internal.util.reflection.FieldSetter;
import org.springframework.data.repository.CrudRepository;

import javax.persistence.EntityManager;
import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.junit.Assert.assertSame;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

public class AuditHandlerTest {

    private static final Long ID = 1L;
    private AuditHandler auditHandler;
    private ProceedingJoinPoint pjp;
    private CrudRepository repository;

    @Before
    public void setUp() {
        AuditorService auditorService = mock(AuditorService.class);
        EntityManager entityManager = mock(EntityManager.class);
        pjp = mock(ProceedingJoinPoint.class);
        repository = mock(CompanyRepository.class);
        auditHandler = new AuditHandler(
                auditorService,
                entityManager
        );
    }

    @Test
    @SuppressWarnings("all")
    @SneakyThrows
    public void whenOnUpdateThenOk() {
        Company entity = new Company();
        Object oldCompany = new Company();
        Object proceed = new Company();
        Long id = 1L;
        Map<Class<?>, Set<String>> auditMap = new HashMap<>();
        auditMap.put(Company.class, Stream.of(Company.class.getDeclaredFields())
                .map(Field::getName)
                .collect(Collectors.toSet()));

        FieldSetter fieldSetter =
                new FieldSetter(auditHandler, AuditHandler.class.getDeclaredField("auditMap"));
        fieldSetter.set(auditMap);

        given(repository.findOne(id)).willReturn(oldCompany);
        given(pjp.proceed()).willReturn(proceed);

        Object resultProceed = auditHandler.onUpdate(pjp, entity, repository, ID);

        assertSame(resultProceed, proceed);
        verify(repository, times(1)).findOne(id);
        verify(pjp, times(1)).proceed();
    }
}