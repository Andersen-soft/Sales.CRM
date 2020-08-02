package com.andersenlab.crm.converter;

import com.andersenlab.crm.model.entities.Company;
import com.andersenlab.crm.model.entities.Contact;
import com.andersenlab.crm.model.entities.Country;
import com.andersenlab.crm.model.entities.SocialNetworkContact;
import com.andersenlab.crm.model.entities.SocialNetworkUser;
import com.andersenlab.crm.rest.response.CompanyDto;
import com.andersenlab.crm.rest.response.ContactResponse;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class ContactToContactResponseConverterTest {

    private ContactToContactResponseConverter converter;

    @Before
    public void setup() {
        converter = new ContactToContactResponseConverter();
    }

    @Test
    public void whenConvertThenFieldsOfConvertedExpected() {
        SocialNetworkUser socialNetworkUser = new SocialNetworkUser();
        socialNetworkUser.setName("name");
        SocialNetworkContact socialNetworkContact = new SocialNetworkContact();
        socialNetworkContact.setSocialNetworkUser(socialNetworkUser);

        Company company = new Company();
        company.setId(1L);
        company.setName("test_company");

        CompanyDto companyDto = new CompanyDto();
        companyDto.setId(company.getId());
        companyDto.setName(company.getName());

        Contact contact = new Contact();
        contact.setEmail("testmail");
        contact.setFirstName("testname");
        contact.setPhone("55555333333");
        contact.setLastName("testSecondName");
        contact.setSkype("testSkype");
        contact.setCountry(new Country());
        contact.setSocialNetworkUser(socialNetworkUser);
        contact.setCompany(company);

        ContactResponse convert = converter.convert(contact);

        assertEquals(contact.getEmail(), convert.getEmail());
        assertEquals(contact.getFirstName(), convert.getFirstName());
        assertEquals(contact.getLastName(), convert.getLastName());
        assertEquals(contact.getPhone(), convert.getPhone());
        assertEquals(contact.getSkype(), convert.getSkype());
        assertEquals(contact.getCompany().getName(), companyDto.getName());
    }

    @Test
    public void whenGetClassesThenReturnExpected() {
        assertEquals(converter.getSource(), Contact.class);
        assertEquals(converter.getTarget(), ContactResponse.class);
    }
}