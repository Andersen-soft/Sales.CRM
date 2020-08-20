package com.andersenlab.crm.configuration.properties;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "passay")
@Getter
@Setter
public class PasswordGeneratorProperties {

    private int lowerCaseCharacters;

    private int upperCaseCharacters;

    private int numberOfDigits;

    private int specialChars;

    private int lengthPassword;

}


