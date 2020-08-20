package com.andersenlab.crm.configuration.properties;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "scheduled")
@Getter
@Setter
public class SchedulerProperties {
    private String cronNightDistribution;
    private String cronNightDistributionMailNotifier;
    private String cronDayDistribution;
}
