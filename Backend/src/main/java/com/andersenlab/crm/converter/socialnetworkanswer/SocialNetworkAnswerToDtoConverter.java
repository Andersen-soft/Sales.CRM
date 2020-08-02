package com.andersenlab.crm.converter.socialnetworkanswer;

import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.entities.Company;
import com.andersenlab.crm.model.entities.Country;
import com.andersenlab.crm.model.entities.SocialNetworkAnswer;
import com.andersenlab.crm.model.entities.Source;
import com.andersenlab.crm.rest.response.CompanySocialAnswerDto;
import com.andersenlab.crm.rest.response.ContactDto;
import com.andersenlab.crm.rest.response.CountryDto;
import com.andersenlab.crm.rest.response.EmployeeDto;
import com.andersenlab.crm.rest.response.SocialAnswerDto;
import com.andersenlab.crm.rest.response.SourceDto;
import com.andersenlab.crm.services.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Locale;
import java.util.Optional;

import static com.andersenlab.crm.services.i18n.I18nConstants.LANGUAGE_TAG_EN;

@Component
@RequiredArgsConstructor
public class SocialNetworkAnswerToDtoConverter implements Converter<SocialNetworkAnswer, SocialAnswerDto> {

    private final CompanyService companyService;

    @Override
    public SocialAnswerDto convert(SocialNetworkAnswer source) {
        SocialAnswerDto dto = new SocialAnswerDto();
        dto.setId(source.getId());
        dto.setCreated(source.getCreateDate());
        dto.setResponsibleDto(defineResponsibleDto(source));
        dto.setContactDto(defineContactDto(source));
        dto.setMessage(source.getMessage());
        dto.setLinkLead(source.getLinkLead());
        dto.setFirstName(source.getFirstName());
        dto.setLastName(source.getLastName());
        dto.setSex(source.getSex());
        dto.setPosition(source.getPosition());
        dto.setCountryDto(defineCountryDto(source.getCountry()));
        dto.setSkype(source.getSkype());
        dto.setEmail(source.getEmail());
        dto.setEmailPrivate(source.getEmailPrivate());
        dto.setPhone(source.getPhone());
        dto.setCompanyDto(defineCompanyDto(source));
        dto.setAssistant(defineAssistantDto(source));
        dto.setSourceDto(defineSourceDto(source));
        Optional.ofNullable(source.getDateOfBirth()).ifPresent(d -> dto.setDateOfBirth(d.toString()));

        return dto;
    }

    @Override
    public SocialAnswerDto convertWithLocale(SocialNetworkAnswer source, Locale locale) {

        SocialAnswerDto target = convert(source);

        if (LANGUAGE_TAG_EN.equalsIgnoreCase(locale.getLanguage())) {
            CountryDto dto = target.getCountryDto();
            if (dto.getName() != null) {
                dto.setName(source.getCountry().getNameEn());
            }
            SourceDto sourceDto = target.getSourceDto();
            if (sourceDto != null) {
                Optional.ofNullable(source.getSource())
                        .ifPresent(s -> sourceDto.setName(s.getNameEn()));
            }
        }
        return target;
    }

    private CompanySocialAnswerDto defineCompanyDto(SocialNetworkAnswer answer) {
        final CompanySocialAnswerDto companyDto = new CompanySocialAnswerDto();
        final Company company = companyService.findCompanyByName(answer.getCompanyName());

        if (company != null) {
            companyDto.setId(company.getId());
            companyDto.setPhone(company.getPhone());
            companyDto.setSite(company.getUrl());
        } else {
            Optional.ofNullable(answer.getSite()).ifPresent(companyDto::setSite);
            Optional.ofNullable(answer.getPhoneCompany()).ifPresent(companyDto::setPhone);
        }

        companyDto.setName(answer.getCompanyName());
        return companyDto;
    }

    private SourceDto defineSourceDto(SocialNetworkAnswer answer) {
        final SourceDto sourceDto = new SourceDto();
        Source source = answer.getSource();
        if (source != null) {
            sourceDto.setId(source.getId());
            sourceDto.setName(source.getName());
        }
        return sourceDto;
    }

    private static CountryDto defineCountryDto(Country country) {
        final CountryDto dto = new CountryDto();
        Optional.ofNullable(country).
                ifPresent(c -> dto.setId(c.getId()));
        Optional.ofNullable(country).
                ifPresent(c -> dto.setName(c.getNameRu()));
        return dto;
    }

    private static ContactDto defineContactDto(SocialNetworkAnswer answer) {
        final ContactDto dto = new ContactDto();
        Optional.ofNullable(answer.getSocialNetworkContact()).
                ifPresent(snc -> dto.setId(snc.getSales().getId()));
        Optional.ofNullable(answer.getSocialNetworkContact()).
                ifPresent(snc -> dto.setName(snc.getSocialNetworkUser().getName()));


        return dto;
    }

    private static EmployeeDto defineResponsibleDto(SocialNetworkAnswer answer) {
        final EmployeeDto dto = new EmployeeDto();
        Optional.ofNullable(answer.getSocialNetworkContact()).
                ifPresent(employee -> dto.setId(employee.getSales().getId()));
        Optional.ofNullable(answer.getSocialNetworkContact()).
                ifPresent(employee -> dto.setFirstName(employee.getSales().getFirstName()));
        Optional.ofNullable(answer.getSocialNetworkContact()).
                ifPresent(employee -> dto.setLastName(employee.getSales().getLastName()));
        return dto;
    }

    private static EmployeeDto defineAssistantDto(SocialNetworkAnswer answer) {
        final EmployeeDto dto = new EmployeeDto();
        Optional.ofNullable(answer.getSocialNetworkContact()).
                ifPresent(employee -> dto.setId(employee.getSalesAssistant().getId()));
        Optional.ofNullable(answer.getSocialNetworkContact()).
                ifPresent(employee -> dto.setFirstName(employee.getSalesAssistant().getFirstName()));
        Optional.ofNullable(answer.getSocialNetworkContact()).
                ifPresent(employee -> dto.setLastName(employee.getSalesAssistant().getLastName()));
        return dto;
    }

    @Override
    public Class<SocialNetworkAnswer> getSource() {
        return SocialNetworkAnswer.class;
    }

    @Override
    public Class<SocialAnswerDto> getTarget() {
        return SocialAnswerDto.class;
    }
}
