package com.andersenlab.crm.converter.resumerequest;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.model.entities.Company;
import com.andersenlab.crm.model.entities.CompanySale;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.model.entities.ResumeRequest;
import com.andersenlab.crm.rest.response.ResumeRequestDto;
import org.junit.Before;
import org.junit.Test;

import java.time.LocalDateTime;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.Mockito.mock;

public class ResumeRequestToResumeRequestDtoTest {

    private final ConversionService conversionService = mock(ConversionService.class);
    private ResumeRequestToResumeRequestDto converter;
    private ResumeRequest resumeRequest;
    private LocalDateTime deadLine;
    private LocalDateTime createdDate;

    @Before
    public void setUp() {
        converter = new ResumeRequestToResumeRequestDto(conversionService);
        resumeRequest = getResumeRequest();
        deadLine = LocalDateTime.now();
        createdDate = LocalDateTime.now().minusDays(1L);
    }

    @Test
    public void whenGetClassesThenReturnExpected() {
        assertEquals(converter.getSource(), ResumeRequest.class);
        assertEquals(converter.getTarget(), ResumeRequestDto.class);
    }

    @Test
    public void convert() {
        ResumeRequestDto result = converter.convert(resumeRequest);
        assertNotNull(result);
        assertEquals("ResumeReques id", resumeRequest.getId(), result.getId());
        assertEquals("ResumeReques name", resumeRequest.getName(), result.getName());
        assertEquals("ResumeReques status", resumeRequest.getStatus().getName(), result.getStatus());
        assertEquals("ResumeReques deadLine", resumeRequest.getDeadline(), result.getDeadLine());
        assertEquals("ResumeReques priority", resumeRequest.getPriority().getName(), result.getPriority());
        assertEquals("ResumeReques createdDate", resumeRequest.getCreateDate(), result.getCreated());
    }

    private ResumeRequest getResumeRequest() {
        ResumeRequest theResumeRequest = new ResumeRequest();
        theResumeRequest.setId(100L);
        theResumeRequest.setName("Тестовый запрос");
        theResumeRequest.setCompany(getCompany());
        theResumeRequest.setAuthor(getAuthor());
        theResumeRequest.setResponsibleRM(getResponsible());
        theResumeRequest.setStatus(ResumeRequest.Status.DONE);
        theResumeRequest.setDeadline(deadLine);
        theResumeRequest.setPriority(ResumeRequest.Priority.MAJOR);
        theResumeRequest.setCompanySale(getCompanySale());
        theResumeRequest.setCreateDate(createdDate);
        return theResumeRequest;
    }

    private Company getCompany() {
        Company company = new Company(12L);
        company.setName("Тестовые рога");
        return company;
    }

    private Employee getAuthor() {
        Employee employee = new Employee(22L);
        employee.setFirstName("Тестовое имя автора");
        employee.setLastName("Тестовая фамилия автора");
        return employee;
    }

    private Employee getResponsible() {
        Employee employee = new Employee(32L);
        employee.setFirstName("Тестовое имя ответственного");
        employee.setLastName("Тестовая фамилия ответственного");
        return employee;
    }

    private CompanySale getCompanySale() {
        CompanySale companySale = new CompanySale();
        companySale.setId(42L);
        return companySale;
    }
}