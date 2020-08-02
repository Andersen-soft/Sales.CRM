package com.andersenlab.crm.converter.company;

import com.andersenlab.crm.model.entities.Company;
import com.andersenlab.crm.model.entities.CompanySale;
import com.andersenlab.crm.rest.response.CompanyResponseSimple;
import org.junit.Before;
import org.junit.Test;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.LongStream;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;

public class CompanyToCompanyResponseSimpleTest {

    private CompanyToCompanyResponseSimple converter;
    private Company company;
    private Long companyId = 10L;
    private String companyName = "Company name 2650";
    private String companyUrl = "https://jira.andersenlab.com/browse/CRM-1146";
    private List<CompanySale> companySaleList;

    @Before
    public void setUp() {
        converter = new CompanyToCompanyResponseSimple();
        companySaleList = getCompanySaleList();
        company = getCompany();
    }

    @Test
    public void whenGetClassesThenReturnExpected() {
        assertEquals(converter.getSource(), Company.class);
        assertEquals(converter.getTarget(), CompanyResponseSimple.class);
    }

    @Test
    public void convert() {
        company.setCompanySales(companySaleList);
        CompanyResponseSimple result = converter.convert(company);
        assertNotNull(result);
        assertEquals("Company id", companyId, result.getId());
        assertEquals("Company name", companyName, result.getName());
        assertEquals("Company url", companyUrl, result.getUrl());
        assertEquals("Company sales list", companySaleList.size(), result.getLinkedSales().size());
    }

    @Test
    public void convertWithOutCompanySales() {
        CompanyResponseSimple result = converter.convert(company);
        assertNotNull(result);
        assertEquals("Company id", companyId, result.getId());
        assertEquals("Company name", companyName, result.getName());
        assertEquals("Company url", companyUrl, result.getUrl());
        assertNull(result.getLinkedSales());
    }

    private List<CompanySale> getCompanySaleList() {
        return LongStream.of(1, 2, 3)
                .mapToObj(l -> {
                    CompanySale companySale = new CompanySale();
                    companySale.setId(l);
                    companySale.setIsActive(true);
                    return companySale;
                })
                .collect(Collectors.toList());
    }

    private Company getCompany() {
        Company tehCompany = new Company();
        tehCompany.setId(companyId);
        tehCompany.setName(companyName);
        tehCompany.setUrl(companyUrl);
        return tehCompany;
    }
}