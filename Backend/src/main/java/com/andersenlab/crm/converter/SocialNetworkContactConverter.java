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

import java.util.Optional;

import static com.andersenlab.crm.utils.ConverterHelper.getNullable;
import static com.andersenlab.crm.utils.ServiceUtils.getByNameOrThrow;

public class SocialNetworkContactConverter extends SimpleConverter<SocialNetworkContactDto, SocialNetworkContact> {

    public SocialNetworkContactConverter() {
        super(SocialNetworkContactConverter::fromDto, SocialNetworkContactConverter::toDto);
    }

    private static SocialNetworkContact fromDto(SocialNetworkContactDto dto) {
        SocialNetworkContact resource = new SocialNetworkContact();
        resource.setId(dto.getId());
        resource.setSocialNetworkUser(userFromDto(dto));
        resource.setSource(sourceFromDto(dto));
        resource.setSales(defineSales(dto));
        resource.setSalesAssistant(defineSalesAssistant(dto));
        return resource;
    }

    private static Employee defineSales(SocialNetworkContactDto dto) {
        final Employee entity = new Employee();
        Optional.ofNullable(dto.getSales()).ifPresent(d -> entity.setId(d.getId()));
        Optional.ofNullable(dto.getSales()).ifPresent(d -> entity.setFirstName(d.getFirstName()));
        Optional.ofNullable(dto.getSales()).ifPresent(d -> entity.setLastName(d.getLastName()));
        return entity;
    }

    private static Employee defineSalesAssistant(SocialNetworkContactDto dto) {
        final Employee entity = new Employee();
        Optional.ofNullable(dto.getSalesAssistant()).ifPresent(d -> entity.setId(d.getId()));
        Optional.ofNullable(dto.getSalesAssistant()).ifPresent(d -> entity.setFirstName(d.getFirstName()));
        Optional.ofNullable(dto.getSalesAssistant()).ifPresent(d -> entity.setFirstName(d.getLastName()));
        return entity;
    }


    private static SocialNetworkContactDto toDto(SocialNetworkContact resource) {
        SocialNetworkContactDto dto = new SocialNetworkContactDto();
        dto.setId(resource.getId());
        dto.setSocialNetworkUser(dtoFromUser(resource));
        dto.setSource(dtoFromSource(resource));
        dto.setSales(defineSalesDto(resource));
        dto.setSalesAssistant(defineSalesAssistantDto(resource));
        return dto;
    }


    private static Source sourceFromDto(SocialNetworkContactDto dto) {
        final Source entity = new Source();
        Optional.ofNullable(dto.getSource()).ifPresent(d -> entity.setId(d.getId()));
        Optional.ofNullable(dto.getSource()).ifPresent(d -> entity.setName(d.getName()));
        Optional.ofNullable(dto.getSource()).ifPresent(d -> entity.setType(getNullable(d.getType(), type -> getByNameOrThrow(Source.Type.class, type))));
        return entity;
    }

    private static SourceDto dtoFromSource(SocialNetworkContact source) {
        final SourceDto dto = new SourceDto();
        Optional.ofNullable(source.getSource()).ifPresent(s -> dto.setId(s.getId()));
        Optional.ofNullable(source.getSource()).ifPresent(s -> dto.setName(s.getName()));
        Optional.ofNullable(source.getSource()).ifPresent(s -> dto.setType(s.getType().getName()));
        return dto;
    }

    private static SocialNetworkUser userFromDto(SocialNetworkContactDto dto) {
        final SocialNetworkUser entity = new SocialNetworkUser();
        Optional.ofNullable(dto.getSocialNetworkUser()).ifPresent(d -> entity.setId(d.getId()));
        Optional.ofNullable(dto.getSocialNetworkUser()).ifPresent(d -> entity.setName(d.getName()));
        return entity;
    }

    private static SocialNetworkUserDto dtoFromUser(SocialNetworkContact source) {
        final SocialNetworkUserDto dto = new SocialNetworkUserDto();
        Optional.ofNullable(source.getSocialNetworkUser()).ifPresent(s -> dto.setId(s.getId()));
        Optional.ofNullable(source.getSocialNetworkUser()).ifPresent(s -> dto.setName(s.getName()));
        return dto;
    }

    private static EmployeeDto defineSalesDto(SocialNetworkContact resource) {
        final EmployeeDto dto = new EmployeeDto();
        Optional.ofNullable(resource.getSales()).ifPresent(s -> dto.setId(s.getId()));
        Optional.ofNullable(resource.getSales()).ifPresent(s -> dto.setFirstName(s.getFirstName()));
        Optional.ofNullable(resource.getSales()).ifPresent(s -> dto.setLastName(s.getLastName()));
        return dto;
    }

    private static EmployeeDto defineSalesAssistantDto(SocialNetworkContact resource) {
        final EmployeeDto dto = new EmployeeDto();
        Optional.ofNullable(resource.getSalesAssistant()).ifPresent(s -> dto.setId(s.getId()));
        Optional.ofNullable(resource.getSalesAssistant()).ifPresent(s -> dto.setFirstName(s.getFirstName()));
        Optional.ofNullable(resource.getSalesAssistant()).ifPresent(s -> dto.setLastName(s.getLastName()));
        return dto;
    }
}
