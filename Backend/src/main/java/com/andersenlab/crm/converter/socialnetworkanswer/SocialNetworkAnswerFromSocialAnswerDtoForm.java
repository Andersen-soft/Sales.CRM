package com.andersenlab.crm.converter.socialnetworkanswer;

import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.entities.Company;
import com.andersenlab.crm.model.entities.Country;
import com.andersenlab.crm.model.entities.SocialNetworkAnswer;
import com.andersenlab.crm.model.entities.SocialNetworkContact;
import com.andersenlab.crm.rest.dto.SocialAnswerDtoForm;
import com.andersenlab.crm.services.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import javax.validation.constraints.NotNull;
import java.util.Optional;

import static com.andersenlab.crm.utils.CrmStringUtils.fixStringDescription;

@Component
@RequiredArgsConstructor
public class SocialNetworkAnswerFromSocialAnswerDtoForm implements Converter<SocialAnswerDtoForm, SocialNetworkAnswer> {
    
    private final CompanyService companyService;

    @Override
    public SocialNetworkAnswer convert(SocialAnswerDtoForm source) {
        final SocialNetworkAnswer target = new SocialNetworkAnswer();
        Optional.ofNullable(source.getSocialNetworkContactId()).ifPresent(s -> target.setSocialNetworkContact(defineSocialNetworkContact(s)));
        target.setMessage(fixStringDescription(source.getMessage()));
        target.setLinkLead(source.getLinkLead());
        target.setFirstName(source.getFirstName());
        target.setLastName(source.getLastName());
        target.setSex(source.getSex());
        Optional.ofNullable(source.getCountryId()).ifPresent(s -> target.setCountry(new Country(s)));
        target.setCompanyName(source.getCompanyName());
        target.setPhoneCompany(defineCompanyPhone(source.getCompanyName()));
        Optional.ofNullable(source.getPosition()).ifPresent(target::setPosition);
        Optional.ofNullable(source.getEmailCorporate()).ifPresent(target::setEmail);
        Optional.ofNullable(source.getEmailPersonal()).ifPresent(target::setEmailPrivate);
        Optional.ofNullable(source.getPhone()).ifPresent(target::setPhone);
        Optional.ofNullable(source.getSkype()).ifPresent(target::setSkype);
        Optional.ofNullable(source.getDateOfBirth()).ifPresent(target::setDateOfBirth);
        Optional.ofNullable(source.getIndustryDtos()).ifPresent(target::setIndustryList);
        return target;
    }

    @Override
    public Class<SocialAnswerDtoForm> getSource() {
        return SocialAnswerDtoForm.class;
    }

    @Override
    public Class<SocialNetworkAnswer> getTarget() {
        return SocialNetworkAnswer.class;
    }

    private static SocialNetworkContact defineSocialNetworkContact(@NotNull Long id) {
        final SocialNetworkContact target = new SocialNetworkContact();
        target.setId(id);
        return target;
    }
    
    private String defineCompanyPhone(String companyName) {
        Company company = companyService.findCompanyByName(companyName);
        return company == null ? "" : company.getPhone();
    }
}
