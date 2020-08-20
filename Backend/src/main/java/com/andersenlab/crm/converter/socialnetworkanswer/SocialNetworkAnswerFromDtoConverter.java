package com.andersenlab.crm.converter.socialnetworkanswer;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.entities.Country;
import com.andersenlab.crm.model.entities.Industry;
import com.andersenlab.crm.model.entities.SocialNetworkAnswer;
import com.andersenlab.crm.model.entities.SocialNetworkContact;
import com.andersenlab.crm.rest.response.CompanySocialAnswerDto;
import com.andersenlab.crm.rest.response.SocialAnswerDto;
import com.andersenlab.crm.utils.CrmLocalDateUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

import static com.andersenlab.crm.utils.CrmStringUtils.fixStringDescription;

@Component
@RequiredArgsConstructor
public class SocialNetworkAnswerFromDtoConverter implements Converter<SocialAnswerDto, SocialNetworkAnswer> {

    private final ConversionService conversionService;

    @Override
    public SocialNetworkAnswer convert(SocialAnswerDto source) {
        SocialNetworkAnswer answer = new SocialNetworkAnswer();
        answer.setId(source.getId());
        answer.setCreateDate(source.getCreated());
        answer.setSocialNetworkContact(defineSocialNetworkContact(source));
        answer.setMessage(fixStringDescription(source.getMessage()));
        answer.setLinkLead(source.getLinkLead());
        answer.setFirstName(source.getFirstName());
        answer.setLastName(source.getLastName());
        answer.setSex(source.getSex());
        answer.setPosition(source.getPosition());
        answer.setCountry(defineCountry(source));
        answer.setSkype(source.getSkype());
        answer.setEmail(source.getEmail());
        answer.setEmailPrivate(source.getEmailPrivate());
        answer.setPhone(source.getPhone());
        answer.setDateOfBirth(CrmLocalDateUtils.convertStringToLocalDate(source.getDateOfBirth()));
        answer.setIndustryList(conversionService.convertToList(source.getIndustryCreateRequestList(), Industry.class));
        defineCompany(source, answer);
        return answer;
    }

    private void defineCompany(SocialAnswerDto source, SocialNetworkAnswer answer) {
        CompanySocialAnswerDto companyDto = source.getCompanyDto();
        answer.setCompanyName(companyDto.getName());
        answer.setSite(companyDto.getSite());
        answer.setPhoneCompany(companyDto.getPhone());
    }

    private static SocialNetworkContact defineSocialNetworkContact(SocialAnswerDto dto) {
        final SocialNetworkContact entity = new SocialNetworkContact();
        Optional.ofNullable(dto.getContactDto()).
                ifPresent(d -> entity.setId(d.getId()));
        return entity;
    }

    private static Country defineCountry(SocialAnswerDto dto) {
        final Country entity = new Country();
        Optional.ofNullable(dto.getCountryDto()).
                ifPresent(d -> entity.setId(d.getId()));
        return entity;
    }

    @Override
    public Class<SocialAnswerDto> getSource() {
        return SocialAnswerDto.class;
    }

    @Override
    public Class<SocialNetworkAnswer> getTarget() {
        return SocialNetworkAnswer.class;
    }
}
