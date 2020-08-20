package com.andersenlab.crm.converter;

import com.andersenlab.crm.model.entities.Company;
import com.andersenlab.crm.rest.sample.CompanySample;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class CompanyToCompanySampleConverterTest {

    private static final String COMPANY_DESCRIPTION = "company description";
    private static final String COMPANY_NAME = "company name";
    private static final String COMPANY_URL = "company url";

    private CompanyToCompanySampleConverter converter = new CompanyToCompanySampleConverter();

    @Test
    public void testConvert() {
        Company source = new Company();
        source.setIsActive(true);
        source.setDescription(COMPANY_DESCRIPTION);
        source.setName(COMPANY_NAME);
        source.setUrl(COMPANY_URL);
        source.setId(1L);

        CompanySample result = converter.convert(source);

        assertEquals(COMPANY_DESCRIPTION, result.getDescription());
        assertEquals(COMPANY_NAME, result.getName());
        assertEquals(COMPANY_URL, result.getUrl());
        assertEquals(true, result.getIsActive());
        assertEquals(1L, result.getId());
    }

    @Test
    public void testGetTarget() {
        Class<CompanySample> expectedResult = CompanySample.class;

        Class<CompanySample> result = converter.getTarget();

        assertEquals(expectedResult, result);
    }

    @Test
    public void testGetSource() {
        Class<Company> expectedResult = Company.class;

        Class<Company> result = converter.getSource();

        assertEquals(expectedResult, result);
    }
}