package com.andersenlab.crm.converter.socialnetworkuser;

import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.entities.SocialNetworkUser;
import com.andersenlab.crm.rest.dto.SocialNetworkUserDto;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class SocialNetworkUserToDto implements Converter<SocialNetworkUser, SocialNetworkUserDto> {

    @Override
    public SocialNetworkUserDto convert(SocialNetworkUser source) {
        final SocialNetworkUserDto target = new SocialNetworkUserDto();
        Optional.ofNullable(source.getId()).ifPresent(target::setId);
        Optional.ofNullable(source.getName()).ifPresent(target::setName);
        return target;
    }

    @Override
    public Class<SocialNetworkUser> getSource() {
        return SocialNetworkUser.class;
    }

    @Override
    public Class<SocialNetworkUserDto> getTarget() {
        return SocialNetworkUserDto.class;
    }
}
