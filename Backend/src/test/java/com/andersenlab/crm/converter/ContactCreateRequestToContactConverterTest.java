package com.andersenlab.crm.converter;

import com.andersenlab.crm.model.entities.Contact;
import com.andersenlab.crm.rest.request.ContactCreateRequest;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class ContactCreateRequestToContactConverterTest {

    private ContactCreateRequestToContactConverter converter;

    @Before
    public void setup() {
        converter = new ContactCreateRequestToContactConverter();
    }

    @Test
    public void whenConvertThenFieldsOfConvertedExpected() {
        ContactCreateRequest contact = new ContactCreateRequest();
        contact.setEmail("testmail");
        contact.setFirstName("testname");
        contact.setContactPhone("55555333333");
        contact.setLastName("testSecondName");
        contact.setSkype("testSkype");

        Contact convert = converter.convert(contact);

        assertEquals(contact.getEmail(), convert.getEmail());
        assertEquals(contact.getFirstName(), convert.getFirstName());
        assertEquals(contact.getLastName(), convert.getLastName());
        assertEquals(contact.getContactPhone(), convert.getPhone());
        assertEquals(contact.getSkype(), convert.getSkype());
    }

    @Test
    public void whenGetClassesThenReturnExpected() {
        assertEquals(converter.getSource(), ContactCreateRequest.class);
        assertEquals(converter.getTarget(), Contact.class);
    }
}