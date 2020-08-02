package com.andersenlab.crm.converter.socialnetworkanswer;

import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.entities.SocialNetworkAnswer;
import com.andersenlab.crm.rest.dto.SocialAnswerDtoForm;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class SocialNetworkAnswerToSocialAnswerDtoForm implements Converter<SocialNetworkAnswer, SocialAnswerDtoForm> {

    @Override
    public SocialAnswerDtoForm convert(SocialNetworkAnswer source) {
        final SocialAnswerDtoForm target = new SocialAnswerDtoForm();
        target.setId(source.getId());
        Optional.ofNullable(source.getSocialNetworkContact()).ifPresent(s -> target.setSocialNetworkContactId(s.getId()));
        target.setMessage(source.getMessage());
        target.setLinkLead(source.getLinkLead());
        target.setFirstName(source.getFirstName());
        target.setLastName(source.getLastName());
        target.setSex(source.getSex());
        Optional.ofNullable(source.getCountry()).ifPresent(s -> target.setCountryId(s.getId()));
        target.setCompanyName(source.getCompanyName());
        Optional.ofNullable(source.getPhoneCompany()).ifPresent(target::setPosition);
        Optional.ofNullable(source.getEmail()).ifPresent(target::setEmailCorporate);
        Optional.ofNullable(source.getEmailPrivate()).ifPresent(target::setEmailPersonal);
        Optional.ofNullable(source.getPhone()).ifPresent(target::setPhone);
        Optional.ofNullable(source.getSkype()).ifPresent(target::setSkype);
        Optional.ofNullable(source.getDateOfBirth()).ifPresent(target::setDateOfBirth);
        Optional.ofNullable(source.getIndustryList()).ifPresent(target::setIndustryDtos);
        return target;
    }

    @Override
    public Class<SocialNetworkAnswer> getSource() {
        return SocialNetworkAnswer.class;
    }

    @Override
    public Class<SocialAnswerDtoForm> getTarget() {
        return SocialAnswerDtoForm.class;
    }

}
