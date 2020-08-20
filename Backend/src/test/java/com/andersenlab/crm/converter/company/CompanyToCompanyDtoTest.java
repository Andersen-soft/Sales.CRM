package com.andersenlab.crm.converter.company;

import com.andersenlab.crm.model.entities.Company;
import com.andersenlab.crm.rest.response.CompanyDto;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

public class CompanyToCompanyDtoTest {

    private CompanyToCompanyDto converter;
    private Company company;

    @Before
    public void setUp() {
        converter = new CompanyToCompanyDto();
        company = getCompany();
    }

    @Test
    public void whenGetClassesThenReturnExpected() {
        assertEquals(converter.getSource(), Company.class);
        assertEquals(converter.getTarget(), CompanyDto.class);
    }

    @Test
    public void convert() {
        CompanyDto result = converter.convert(company);
        assertNotNull(result);
        assertEquals("Company id", company.getId(), result.getId());
        assertEquals("Company name", company.getName(), result.getName());
    }

    private Company getCompany() {
        Company theCompany = new Company(12L);
        theCompany.setName("Тестовые рога");
        return theCompany;
    }
}