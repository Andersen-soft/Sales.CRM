package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.model.entities.ResumeRequest;
import com.andersenlab.crm.model.entities.SaleRequest;
import com.andersenlab.crm.rest.sample.EmployeeSample;
import com.andersenlab.crm.rest.sample.SaleRequestSample;
import org.junit.Test;

import java.time.LocalDateTime;

import static org.junit.Assert.assertEquals;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

public class SaleRequestToSaleRequestSampleConverterTest {

    private ConversionService conversionService = mock(ConversionService.class);
    private SaleRequestToSaleRequestSampleConverter<SaleRequest> converter = new SaleRequestToSaleRequestSampleConverter<SaleRequest>(conversionService) {

        @Override
        public SaleRequestSample convert(SaleRequest source) {
            return null;
        }

        @Override
        public Class<SaleRequest> getSource() {
            return null;
        }
    };

    @Test
    public void testConvert() {
        Employee employee = new Employee();
        EmployeeSample employeeSample = new EmployeeSample();
        SaleRequest resumeRequest = new ResumeRequest();
        resumeRequest.setIsActive(true);
        resumeRequest.setIsFavorite(true);
        resumeRequest.setResponsibleRM(employee);
        resumeRequest.setDeadline(LocalDateTime.of(2018,12,10,10,10,10));
        resumeRequest.setId(1L);
        SaleRequestSample saleRequestSample = new SaleRequestSample();

        given(conversionService.convert(employee, EmployeeSample.class)).willReturn(employeeSample);

        converter.setGenericFields(resumeRequest, saleRequestSample);

        assertEquals(resumeRequest.getDeadline().toLocalDate(), saleRequestSample.getDeadline());
        assertEquals(resumeRequest.getId(), saleRequestSample.getId());
        assertEquals(employeeSample, saleRequestSample.getResponsibleRm());
        assertEquals(resumeRequest.getIsActive(), saleRequestSample.getIsActive());
        assertEquals(resumeRequest.getIsFavorite(), saleRequestSample.getIsFavorite());
    }

    @Test
    public void testGetTarget() {
        Class<SaleRequestSample> expectedResult = SaleRequestSample.class;

        Class<SaleRequestSample> result = converter.getTarget();

        assertEquals(expectedResult, result);
    }
}
