package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.model.entities.File;
import com.andersenlab.crm.model.entities.Rating;
import com.andersenlab.crm.model.entities.Resume;
import com.andersenlab.crm.rest.response.ResumeResponse;
import com.andersenlab.crm.rest.sample.EmployeeSample;
import org.junit.Before;
import org.junit.Test;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

public class ResumeToDtoConverterTest {

    private ConversionService conversionService;
    private ResumeToDtoConverter converter;

    @Before
    public void setUp() {
        conversionService = mock(ConversionService.class);
        converter = new ResumeToDtoConverter(conversionService);
    }

    @Test
    public void whenConvertThenFieldsOfConvertedExpected() {
        Rating rating = new Rating();
        rating.setRate(1);
        Employee employee = new Employee();
        employee.setId(1L);
        LocalDateTime createDate = LocalDateTime.now();
        List<File> files = new ArrayList<>();

        Resume resume = new Resume();
        resume.setId(1L);
        resume.setFio("Fio");
        resume.setIsActive(true);
        resume.setResponsibleHr(employee);
        resume.setStatus(Resume.Status.IN_PROGRESS);
        resume.setCreateDate(createDate);
        resume.setFiles(files);
        resume.setHrComment("comment");


        EmployeeSample employeeSample = new EmployeeSample();
        employeeSample.setId(1L);
        given(conversionService.convert(resume.getResponsibleHr(), EmployeeSample.class))
                .willReturn(employeeSample);

        ResumeResponse converted = converter.convert(resume);

        assertEquals(resume.getId(), converted.getId());
        assertEquals(resume.getFio(), converted.getFio());
        assertEquals(resume.getIsActive(), converted.getIsActive());
        assertEquals(resume.getResponsibleHr().getId(), converted.getResponsibleEmployee().getId());
        assertEquals(resume.getStatus().getName(), converted.getStatus());
        assertEquals(resume.getHrComment(), converted.getHrComment());
    }

    @Test
    public void whenGetClassesThenReturnExpected() {
        assertEquals(converter.getSource(), Resume.class);
        assertEquals(converter.getTarget(), ResumeResponse.class);
    }
}