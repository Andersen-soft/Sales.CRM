package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.entities.Contact;
import com.andersenlab.crm.model.entities.Country;
import com.andersenlab.crm.model.entities.SocialNetworkUser;
import com.andersenlab.crm.rest.request.ContactCreateRequest;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class ContactCreateRequestToContactConverter implements Converter<ContactCreateRequest, Contact> {

    @Override
    public Contact convert(ContactCreateRequest source) {
        Contact target = new Contact();
        target.setFirstName(source.getFirstName());
        target.setLastName(source.getLastName());
        target.setPosition(source.getPosition());
        target.setEmail(source.getEmail());
        target.setSkype(source.getSkype());
        target.setSocialNetwork(source.getSocialNetwork());
        target.setPhone(source.getContactPhone());
        target.setPersonalEmail(source.getPersonalEmail());
        target.setSex(source.getSex());
        target.setCountry(defineCountry(source));
        target.setSocialNetworkUser(defineSocialNetworkUser(source));
        target.setDateOfBirth(source.getDateOfBirth());
        return target;
    }


    private Country defineCountry(ContactCreateRequest source) {
        return Optional.ofNullable(source.getCountryId())
                .map(Country::new)
                .orElse(null);
    }

    private SocialNetworkUser defineSocialNetworkUser(ContactCreateRequest source) {
        return Optional.ofNullable(source.getSocialNetworkUserId())
                .map(SocialNetworkUser::new)
                .orElse(null);
    }

    @Override
    public Class<ContactCreateRequest> getSource() {
        return ContactCreateRequest.class;
    }

    @Override
    public Class<Contact> getTarget() {
        return Contact.class;
    }
}
