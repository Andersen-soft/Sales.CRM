package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.model.entities.Company;
import com.andersenlab.crm.rest.request.CompanyCreateRequest;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class CompanyCreateRequestToCompanyConverterTest {

    private CompanyCreateRequestToCompanyConverter converter;
    private ConversionService conversionService;

    @Before
    public void setup() {
        converter = new CompanyCreateRequestToCompanyConverter(conversionService);
    }

    @Test
    public void whenConvertThenFieldsOfConvertedExpected() {
        CompanyCreateRequest request = new CompanyCreateRequest();
        request.setName("Test");
        request.setDescription("Description");

        Company converted = converter.convert(request);

        assertEquals(request.getName(), converted.getName());
        assertEquals(request.getDescription(), converted.getDescription());
    }

    @Test
    public void whenGetClassesThenReturnExpected() {
        assertEquals(converter.getSource(), CompanyCreateRequest.class);
        assertEquals(converter.getTarget(), Company.class);
    }
}