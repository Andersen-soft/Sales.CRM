package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.SimpleConverter;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.model.entities.SocialNetworkContact;
import com.andersenlab.crm.model.entities.SocialNetworkUser;
import com.andersenlab.crm.model.entities.Source;
import com.andersenlab.crm.rest.dto.EmployeeDto;
import com.andersenlab.crm.rest.dto.SocialNetworkContactDto;
import com.andersenlab.crm.rest.dto.SocialNetworkUserDto;
import com.andersenlab.crm.rest.response.SourceDto;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

public class SocialNetworkContactConverterTest {

    private SimpleConverter<SocialNetworkContactDto, SocialNetworkContact> converter;

    private SocialNetworkContactDto dto;
    private SocialNetworkContact entity;

    private Long socialNetworkUserId = 1L;
    private String socialNetworkUserName = "Soc net user name";
    private Long sourceId = 2L;
    private String sourceName = "Source name";
    private Long salesId = 3L;
    private String salesFirstName = "sales first name";
    private String salesLastName = "sales last name";
    private Long salesAssistantId = 4L;
    private String salesAssistantFirstName = "sales assistant first name";
    private String salesAssistantLastName = "sales assistant last name";
    private boolean autoDestribution = false;

    @Before
    public void setUp() {
        converter = new SocialNetworkContactConverter();
        dto = defineSocialNetworkContactDto();
        entity = defineSocialNetworkContactEntity();
    }

    @Test
    public void convertFromDtoNull() {
        SocialNetworkContact result = converter.convertFromDto(new SocialNetworkContactDto());
        assertNotNull(result);
    }

    @Test
    public void convertFromEntityNull() {
        SocialNetworkContactDto result = converter.convertFromEntity(new SocialNetworkContact());
        assertNotNull(result);
    }

    @Test
    public void convertFromDto() {
        SocialNetworkContact result = converter.convertFromDto(dto);
        assertNotNull(result);
        assertEquals("SocialNetworkContact.id", dto.getId(), result.getId());
        assertEquals("SocialNetworkUser.id", socialNetworkUserId, result.getSocialNetworkUser().getId());
        assertEquals("Source.id", sourceId, result.getSource().getId());
        assertEquals("Sales.id", salesId, result.getSales().getId());
        assertEquals("SalesAssistant.id", salesAssistantId, result.getSalesAssistant().getId());
    }

    @Test
    public void convertFromEntity() {
        SocialNetworkContactDto result = converter.convertFromEntity(entity);
        assertNotNull(result);
        assertEquals("SocialNetworkContact.id", entity.getId(), result.getId());
        assertEquals("SocialNetworkUser.id", socialNetworkUserId, result.getSocialNetworkUser().getId());
        assertEquals("Source.id", sourceId, result.getSource().getId());
        assertEquals("Sales.id", salesId, result.getSales().getId());
        assertEquals("SalesAssistant.id", salesAssistantId, result.getSalesAssistant().getId());
    }

    private SocialNetworkContactDto defineSocialNetworkContactDto() {
        SocialNetworkUserDto socialNetworkUserDto = new SocialNetworkUserDto(socialNetworkUserId, socialNetworkUserName);
        SourceDto sourceDto = new SourceDto(sourceId, sourceName, Source.Type.OTHER.getName());
        EmployeeDto salesDto = new EmployeeDto(salesId, salesFirstName, salesLastName,autoDestribution);
        EmployeeDto salesAssistantDto = new EmployeeDto(salesAssistantId, salesAssistantFirstName, salesAssistantLastName,autoDestribution);
        SocialNetworkContactDto networkContactDto = new SocialNetworkContactDto();
        networkContactDto.setSocialNetworkUser(socialNetworkUserDto);
        networkContactDto.setSource(sourceDto);
        networkContactDto.setSales(salesDto);
        networkContactDto.setSalesAssistant(salesAssistantDto);
        return networkContactDto;
    }

    private SocialNetworkContact defineSocialNetworkContactEntity() {
        SocialNetworkUser socialNetworkUser = new SocialNetworkUser(socialNetworkUserId);
        socialNetworkUser.setName(socialNetworkUserName);
        Source source = new Source(sourceId);
        source.setName(sourceName);
        source.setType(Source.Type.OTHER);
        Employee sales = new Employee();
        sales.setId(salesId);
        sales.setFirstName(salesFirstName);
        Employee salesAssistant = new Employee();
        salesAssistant.setId(salesAssistantId);
        salesAssistant.setFirstName(salesAssistantFirstName);
        SocialNetworkContact socialNetworkContact = new SocialNetworkContact();
        socialNetworkContact.setSocialNetworkUser(socialNetworkUser);
        socialNetworkContact.setSource(source);
        socialNetworkContact.setSales(sales);
        socialNetworkContact.setSalesAssistant(salesAssistant);
        return socialNetworkContact;
    }
}
