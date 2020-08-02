package com.andersenlab.crm.rest.facade;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.model.entities.SocialNetworkContact;
import com.andersenlab.crm.rest.DtoResponse;
import com.andersenlab.crm.rest.dto.EmployeeDto;
import com.andersenlab.crm.rest.dto.SocialNetworkContactDto;
import com.andersenlab.crm.rest.response.SourceDto;
import com.andersenlab.crm.services.EmployeeService;
import com.andersenlab.crm.services.SocialNetworkContactService;
import com.andersenlab.crm.services.SourceService;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertNotNull;
import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.mock;

public class SocialNetworkContactFacadeImplTest {

    private SocialNetworkContactFacade socialNetworkContactFacade;
    private SocialNetworkContactService networkContactService;

    @Before
    public void setUp() {
        networkContactService = mock(SocialNetworkContactService.class);
        EmployeeService employeeService = mock(EmployeeService.class);
        SourceService sourceService = mock(SourceService.class);
        ConversionService conversionService = mock(ConversionService.class);
        socialNetworkContactFacade = new SocialNetworkContactFacadeImpl(
                networkContactService,
                employeeService,
                sourceService,
                conversionService
        );
    }

    @Test(expected = IllegalArgumentException.class)
    public void createIllegalArgumentException() {
        EmployeeDto salesDto = new EmployeeDto();
        EmployeeDto salesAssistantDto = new EmployeeDto();
        SocialNetworkContactDto dto = new SocialNetworkContactDto();
        dto.setSales(salesDto);
        dto.setSalesAssistant(salesAssistantDto);

        given(networkContactService.create(any(SocialNetworkContact.class))).willReturn(new SocialNetworkContact());
        DtoResponse<SocialNetworkContactDto> response = socialNetworkContactFacade.create(dto);
        assertNotNull(response);
    }

    @Test
    public void create() {
        EmployeeDto salesDto = new EmployeeDto(1L);
        EmployeeDto salesAssistantDto = new EmployeeDto(2L);
        SourceDto sourceDto = new SourceDto(4L);
        SocialNetworkContactDto dto = new SocialNetworkContactDto();
        dto.setSales(salesDto);
        dto.setSalesAssistant(salesAssistantDto);
        dto.setSource(sourceDto);

        given(networkContactService.create(any(SocialNetworkContact.class))).willReturn(new SocialNetworkContact());
        DtoResponse<SocialNetworkContactDto> response = socialNetworkContactFacade.create(dto);
        assertNotNull(response);
    }
}