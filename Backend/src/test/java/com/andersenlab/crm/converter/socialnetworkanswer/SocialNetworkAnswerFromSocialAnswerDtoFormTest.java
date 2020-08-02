package com.andersenlab.crm.converter.socialnetworkanswer;

import com.andersenlab.crm.model.Sex;
import com.andersenlab.crm.model.entities.SocialNetworkAnswer;
import com.andersenlab.crm.rest.dto.SocialAnswerDtoForm;
import com.andersenlab.crm.services.CompanyService;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.mockito.Mockito.mock;

public class SocialNetworkAnswerFromSocialAnswerDtoFormTest {

    private SocialNetworkAnswerFromSocialAnswerDtoForm converter;
    private SocialAnswerDtoForm dto;

    @Before
    public void setUp() {
        CompanyService companyService = mock(CompanyService.class);
        converter = new SocialNetworkAnswerFromSocialAnswerDtoForm(companyService);
        dto = new SocialAnswerDtoForm();
        dto.setId(10L);
        dto.setCompanyName("Company name");
        dto.setFirstName("first name");
        dto.setLastName("last name");
        dto.setLinkLead("https://jira.andersenlab.com/browse/CRM-2839");
        dto.setMessage("Сообщение абра кадабра тирли бом");
        dto.setSex(Sex.MALE);
    }

    @Test
    public void whenGetClassesThenReturnExpected() {
        assertEquals(converter.getSource(), SocialAnswerDtoForm.class);
        assertEquals(converter.getTarget(), SocialNetworkAnswer.class);
    }

    @Test
    public void convert() {
        SocialNetworkAnswer result = converter.convert(dto);
        assertNotNull(result);
        assertNull("id", result.getId());
        assertEquals("Company name", dto.getCompanyName(), result.getCompanyName());
        assertEquals("First name", dto.getFirstName(), result.getFirstName());
        assertEquals("Last name", dto.getLastName(), result.getLastName());
        assertEquals("Link lead", dto.getLinkLead(), result.getLinkLead());
        assertEquals("CompanySale Status", dto.getSex(), result.getSex());
        assertNull(result.getCountry());
        assertNull(result.getSocialNetworkContact());
    }

    @Test
    public void convertWithCountry() {
        dto.setCountryId(4l);
        SocialNetworkAnswer result = converter.convert(dto);
        assertNotNull(result);
        assertNotNull(result.getCountry());
        assertEquals("Country", dto.getCountryId(), result.getCountry().getId());
    }

    @Test
    public void convertWithContact() {
        dto.setSocialNetworkContactId(4l);
        SocialNetworkAnswer result = converter.convert(dto);
        assertNotNull(result);
        assertNotNull(result.getSocialNetworkContact());
        assertEquals("Contact", dto.getSocialNetworkContactId(), result.getSocialNetworkContact().getId());
    }

}