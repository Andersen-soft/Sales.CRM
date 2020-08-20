package com.andersenlab.crm.configuration.properties;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration class representing general properties specified for this application.
 */
@Configuration
@ConfigurationProperties(prefix = "app")
@Getter
@Setter
public class ApplicationProperties {
    /**
     * Link to application website. Used in mail body templates.
     */
    private String url;

    /**
     * Application timezone. Used to specify current server time.
     */
    private String timezone;

    /**
     * Helper url to define a country by given IP.
     *
     * @see com.andersenlab.crm.services.distribution.CompanySaleRegionalDistributionService
     */
    private String regionApiUrl;
}
