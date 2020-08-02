package com.andersenlab.crm.configuration;

import org.apache.commons.validator.routines.EmailValidator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ValidatorConfig {

    @Bean
    public EmailValidator getEmailValidator() {
        return EmailValidator.getInstance();
    }
}
