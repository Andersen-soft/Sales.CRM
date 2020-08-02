package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.model.entities.CompanySale;
import com.andersenlab.crm.model.entities.Contact;
import com.andersenlab.crm.rest.response.CompanySaleResponse;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.mockito.Mockito.mock;

public class CompanySaleToCompanySaleResponseConverterTest {

    private CompanySaleToCompanySaleResponseConverter converter;
    private ConversionService conversionService;

    @Before
    public void setup() {
        conversionService = mock(ConversionService.class);
        converter = new CompanySaleToCompanySaleResponseConverter(conversionService);
    }

    @Test
    public void whenConvertThenExecuteSuccessfully() {
        Contact contact = new Contact();
        contact.setId(2L);
        contact.setFirstName("FIO");
        CompanySale companySale = new CompanySale();
        companySale.setId(1L);
        companySale.setStatus(CompanySale.Status.CONTRACT);
        companySale.setMainContact(contact);

        CompanySaleResponse response = converter.convert(companySale);

        assertEquals(response.getDescription(), companySale.getDescription());
        assertEquals(response.getId(), companySale.getId());
    }

    @Test
    public void givenNullFieldsSourceWhenConvertThenReturnNullFieldsResponse() {
        CompanySaleResponse response = converter.convert(new CompanySale());
        assertNotNull(response);
        assertNull(response.getId());
        assertNull(response.getMainContact());
    }

    @Test
    public void testConverterSourceAndTarget() {
        assertEquals(converter.getSource(), CompanySale.class);
        assertEquals(converter.getTarget(), CompanySaleResponse.class);
    }
}