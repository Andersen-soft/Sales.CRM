package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.entities.SocialNetworkContact;
import com.andersenlab.crm.rest.dto.EmployeeDto;
import com.andersenlab.crm.rest.dto.SocialNetworkContactDto;
import com.andersenlab.crm.rest.dto.SocialNetworkUserDto;
import com.andersenlab.crm.rest.response.SourceDto;
import org.springframework.stereotype.Component;

import java.util.Locale;
import java.util.Optional;

import static com.andersenlab.crm.services.i18n.I18nConstants.LANGUAGE_TAG_EN;

@Component
public class SocialNetworkContactToDtoConverter implements Converter<SocialNetworkContact, SocialNetworkContactDto> {
    @Override
    public SocialNetworkContactDto convert(SocialNetworkContact source) {
        SocialNetworkContactDto dto = new SocialNetworkContactDto();
        dto.setId(source.getId());
        dto.setSocialNetworkUser(dtoFromUser(source));
        dto.setSource(dtoFromSource(source));
        dto.setSales(defineSalesDto(source));
        dto.setSalesAssistant(defineSalesAssistantDto(source));
        return dto;
    }

    @Override
    public SocialNetworkContactDto convertWithLocale(SocialNetworkContact source, Locale locale) {
        SocialNetworkContactDto target = convert(source);
        if (LANGUAGE_TAG_EN.equalsIgnoreCase(locale.getLanguage())
                && Optional.ofNullable(source.getSource()).isPresent()) {
            Optional.ofNullable(source.getSource().getNameEn()).ifPresent(s -> target.getSource().setName(s));
        }
        return target;
    }

    private SocialNetworkUserDto dtoFromUser(SocialNetworkContact source) {
        SocialNetworkUserDto dto = new SocialNetworkUserDto();
        Optional.ofNullable(source.getSocialNetworkUser()).ifPresent(s -> dto.setId(s.getId()));
        Optional.ofNullable(source.getSocialNetworkUser()).ifPresent(s -> dto.setName(s.getName()));
        return dto;
    }

    private SourceDto dtoFromSource(SocialNetworkContact source) {
        SourceDto dto = new SourceDto();
        Optional.ofNullable(source.getSource()).ifPresent(s -> dto.setId(s.getId()));
        Optional.ofNullable(source.getSource()).ifPresent(s -> dto.setName(s.getName()));
        Optional.ofNullable(source.getSource()).ifPresent(s -> dto.setType(s.getType().getName()));
        return dto;
    }

    private EmployeeDto defineSalesDto(SocialNetworkContact resource) {
        EmployeeDto dto = new EmployeeDto();
        Optional.ofNullable(resource.getSales()).ifPresent(s -> dto.setId(s.getId()));
        Optional.ofNullable(resource.getSales()).ifPresent(s -> dto.setFirstName(s.getFirstName()));
        Optional.ofNullable(resource.getSales()).ifPresent(s -> dto.setLastName(s.getLastName()));
        return dto;
    }

    private EmployeeDto defineSalesAssistantDto(SocialNetworkContact resource) {
        EmployeeDto dto = new EmployeeDto();
        Optional.ofNullable(resource.getSalesAssistant()).ifPresent(s -> dto.setId(s.getId()));
        Optional.ofNullable(resource.getSalesAssistant()).ifPresent(s -> dto.setFirstName(s.getFirstName()));
        Optional.ofNullable(resource.getSalesAssistant()).ifPresent(s -> dto.setLastName(s.getLastName()));
        return dto;
    }

    @Override
    public Class<SocialNetworkContact> getSource() {
        return SocialNetworkContact.class;
    }

    @Override
    public Class<SocialNetworkContactDto> getTarget() {
        return SocialNetworkContactDto.class;
    }
}
