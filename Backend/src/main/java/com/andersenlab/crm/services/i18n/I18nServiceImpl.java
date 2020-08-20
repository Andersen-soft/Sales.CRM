package com.andersenlab.crm.services.i18n;

import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

import static com.andersenlab.crm.utils.ServiceUtils.getAvailableLocales;

/**
 * Base implementation of internationalization service.
 */
@Service
@RequiredArgsConstructor
public class I18nServiceImpl implements I18nService {
    /**
     * MessageSource bean.
     *
     * @see com.andersenlab.crm.configuration.I18nConfiguration
     */
    private final MessageSource messageSource;

    @Override
    public String getLocalizedMessage(String key, Locale locale) {
        return messageSource.getMessage(key, null, locale);
    }

    @Override
    public List<String> getMessagesByKey(String key) {
        List<Locale> allLocales = getAvailableLocales();
        return allLocales.stream()
                .map(v -> getLocalizedMessage(key, v))
                .collect(Collectors.toList());
    }
}
