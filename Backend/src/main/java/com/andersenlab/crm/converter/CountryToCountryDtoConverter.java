package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.entities.Country;
import com.andersenlab.crm.rest.response.CountryDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Locale;

import static com.andersenlab.crm.services.i18n.I18nConstants.LANGUAGE_TAG_EN;

@Component
@RequiredArgsConstructor
public class CountryToCountryDtoConverter implements Converter<Country, CountryDto> {
    @Override
    public CountryDto convert(Country source) {
        CountryDto target = new CountryDto();
        target.setId(source.getId());
        target.setName(source.getNameRu());
        return target;
    }

    @Override
    public CountryDto convertWithLocale(Country source, Locale locale) {
        CountryDto target = convert(source);
        if (LANGUAGE_TAG_EN.equalsIgnoreCase(locale.getLanguage())) {
            target.setName(source.getNameEn());
        }

        return target;
    }

    @Override
    public Class<Country> getSource() {
        return Country.class;
    }

    @Override
    public Class<CountryDto> getTarget() {
        return CountryDto.class;
    }
}
