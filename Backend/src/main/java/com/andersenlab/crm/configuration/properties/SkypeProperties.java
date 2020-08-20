package com.andersenlab.crm.configuration.properties;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "skype")
@Getter
@Setter
public class SkypeProperties {
    private SkypePropertiesClient client;
    private String grandType;
    private String scope;
    private String tokenUrl;
    private String apiUrl;
    private SkypePropertiesChat chat;
    private SkypePropertiesUrl url;
}
