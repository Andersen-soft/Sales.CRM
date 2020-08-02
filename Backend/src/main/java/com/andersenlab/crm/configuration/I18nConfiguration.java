package com.andersenlab.crm.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.i18n.AcceptHeaderLocaleResolver;

import java.util.Locale;

/**
 * Spring MVC internationalization configuration class.
 */
@Configuration
public class I18nConfiguration {
    @Bean
    public LocaleResolver localeResolver() {
        AcceptHeaderLocaleResolver acceptHeaderLocaleResolver
                = new AcceptHeaderLocaleResolver();

        acceptHeaderLocaleResolver.setDefaultLocale(Locale.US);
        return acceptHeaderLocaleResolver;
    }

    @Bean
    public ReloadableResourceBundleMessageSource messageSource() {
        ReloadableResourceBundleMessageSource messageSource
                = new ReloadableResourceBundleMessageSource();

        messageSource.setBasename("classpath:i18n/crm_locale");

        messageSource.setFallbackToSystemLocale(true);
        messageSource.setUseCodeAsDefaultMessage(true);

        return messageSource;
    }
}
