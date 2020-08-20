package com.andersenlab.crm.converter;

import com.andersenlab.crm.model.entities.CompanySale;
import com.andersenlab.crm.rest.sample.CompanySaleSample;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class CompanySaleToCompanySaleSampleConverterTest {

    private CompanySaleToCompanySaleSampleConverter converter;

    @Before
    public void setup() {
        converter = new CompanySaleToCompanySaleSampleConverter();
    }

    @Test
    public void whenConvertedThenFieldsSet() {
        CompanySale companySale = new CompanySale();
        companySale.setStatus(CompanySale.Status.CONTRACT);
        companySale.setId(1L);

        CompanySaleSample convert = converter.convert(companySale);

        assertEquals(convert.getDescription(), companySale.getDescription());
        assertEquals(convert.getId(), companySale.getId());
    }

    @Test
    public void whenGetClassesThenReturnExpected() {
        assertEquals(converter.getSource(), CompanySale.class);
        assertEquals(converter.getTarget(), CompanySaleSample.class);
    }
}