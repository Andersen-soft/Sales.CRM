package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.SimpleConverter;
import com.andersenlab.crm.model.entities.SocialNetworkUser;
import com.andersenlab.crm.rest.dto.SocialNetworkUserDto;

public class SocialNetworkUserConverter extends SimpleConverter<SocialNetworkUserDto, SocialNetworkUser> {

    public SocialNetworkUserConverter() {
        super(SocialNetworkUserConverter::fromDto, SocialNetworkUserConverter::toDto);
    }

    private static SocialNetworkUser fromDto(SocialNetworkUserDto dto) {
        SocialNetworkUser resource = new SocialNetworkUser();
        resource.setId(dto.getId());
        resource.setName(dto.getName());
        return resource;
    }

    private static SocialNetworkUserDto toDto(SocialNetworkUser resource) {
        SocialNetworkUserDto dto = new SocialNetworkUserDto();
        dto.setId(resource.getId());
        dto.setName(resource.getName());
        return dto;
    }
}
