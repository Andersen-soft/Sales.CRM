package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.entities.Company;
import com.andersenlab.crm.model.entities.CompanySale;
import com.andersenlab.crm.model.entities.Contact;
import com.andersenlab.crm.model.entities.Country;
import com.andersenlab.crm.model.entities.SocialNetworkUser;
import com.andersenlab.crm.rest.dto.SocialNetworkUserDto;
import com.andersenlab.crm.rest.response.CompanyDto;
import com.andersenlab.crm.rest.response.ContactResponse;
import com.andersenlab.crm.rest.response.CountryDto;
import com.andersenlab.crm.services.i18n.I18nConstants;
import com.andersenlab.crm.utils.ConverterHelper;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

import static java.util.Optional.ofNullable;

@AllArgsConstructor
@Component
public class ContactToContactResponseConverter implements Converter<Contact, ContactResponse> {

    @Override
    public ContactResponse convert(Contact source) {
        ContactResponse target = new ContactResponse();
        target.setId(source.getId());
        target.setIsActive(source.getIsActive());
        target.setFirstName(source.getFirstName());
        target.setLastName(source.getLastName() != null ? source.getLastName() : "");
        target.setPosition(source.getPosition());
        target.setEmail(source.getEmail());
        target.setSkype(source.getSkype());
        target.setSocialNetwork(source.getSocialNetwork());
        target.setSocialNetworkUser(ConverterHelper.getNullable(source.getSocialNetworkUser(), this::defineSocialNetworkUserDto));
        target.setPhone(source.getPhone());
        target.setPersonalEmail(source.getPersonalEmail());
        ofNullable(source.getCountry()).ifPresent(country -> target.setCountry(defineCountry(country)));
        target.setSex(source.getSex());
        ofNullable(source.getSales()).ifPresent(companySales ->
                target.setContactRelatedSales(getRelatedSalesIds(companySales))
        );
        ofNullable(source.getCompany()).ifPresent(company -> {
            target.setCompanyRelatedSales(getRelatedSalesIds(company.getCompanySales()));
            target.setCompany(defineCompany(company));
        });
        target.setDateOfBirth(source.getDateOfBirth());
        return target;
    }

    private CountryDto defineCountry(final Country country){
        final CountryDto countryDto = new CountryDto();
        countryDto.setId(country.getId());
        countryDto.setName(country.getNameRu());
        return countryDto;
    }

    private CountryDto defineCountryEn(final Country country){
        final CountryDto countryDto = new CountryDto();
        countryDto.setId(country.getId());
        countryDto.setName(country.getNameEn());
        return countryDto;
    }

    private CompanyDto defineCompany(final Company company) {
        final CompanyDto companyDto = new CompanyDto();
        companyDto.setId(company.getId());
        companyDto.setName(company.getName());
        return companyDto;
    }

    private List<Long> getRelatedSalesIds(final List<CompanySale> companySales){
        return ofNullable(companySales)
                .map(sales -> sales.stream()
                        .filter(CompanySale::getIsActive)
                        .map(CompanySale::getId)
                        .collect(Collectors.toList()))
                .orElse(new ArrayList<>());
    }

    private SocialNetworkUserDto defineSocialNetworkUserDto(SocialNetworkUser source) {
        final SocialNetworkUserDto dto = new SocialNetworkUserDto();
        ofNullable(source.getId()).ifPresent(dto::setId);
        ofNullable(source.getName()).ifPresent(dto::setName);
        return dto;
    }

    @Override
    public Class<Contact> getSource() {
        return Contact.class;
    }

    @Override
    public Class<ContactResponse> getTarget() {
        return ContactResponse.class;
    }

    @Override
    public ContactResponse convertWithLocale(Contact source, Locale locale) {
        ContactResponse contactResponse = convert(source);
        if (locale.getLanguage().equalsIgnoreCase(I18nConstants.LANGUAGE_TAG_EN)) {
            ofNullable(source.getCountry()).ifPresent(country -> contactResponse.setCountry(defineCountryEn(country)));
        } else {
            ofNullable(source.getCountry()).ifPresent(country -> contactResponse.setCountry(defineCountry(country)));
        }
        return contactResponse;
    }

}
