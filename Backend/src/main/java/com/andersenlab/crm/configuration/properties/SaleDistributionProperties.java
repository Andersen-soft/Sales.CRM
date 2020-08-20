package com.andersenlab.crm.configuration.properties;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "distribution")
@Getter
@Setter
public class SaleDistributionProperties {
    private int lifetimeDayDistribution;
    private int lifetimeNightDistribution;
}
