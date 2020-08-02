package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.entities.Source;
import com.andersenlab.crm.rest.response.SourceResponse;
import org.springframework.stereotype.Component;

import java.util.Locale;
import java.util.Optional;

import static com.andersenlab.crm.services.i18n.I18nConstants.LANGUAGE_TAG_EN;

@Component
public class SourceToSourceResponseConverter implements Converter<Source, SourceResponse> {
    @Override
    public SourceResponse convert(Source source) {
        SourceResponse response = new SourceResponse();
        response.setId(source.getId());
        response.setName(source.getName());
        response.setType(source.getType().getName());
        response.setDescription(source.getDescriptionRu());
        return response;
    }

    @Override
    public SourceResponse convertWithLocale(Source source, Locale locale) {
        SourceResponse target = convert(source);
        if (LANGUAGE_TAG_EN.equalsIgnoreCase(locale.getLanguage())) {
            Optional.ofNullable(source.getNameEn()).ifPresent(target::setName);
            Optional.ofNullable(source.getDescriptionEn()).ifPresent(target::setDescription);
        }
        return target;
    }

    @Override
    public Class<Source> getSource() {
        return Source.class;
    }

    @Override
    public Class<SourceResponse> getTarget() {
        return SourceResponse.class;
    }
}
