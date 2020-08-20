package com.andersenlab.crm.configuration.properties;


import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration class representing properties for storage.
 */
@Configuration
@ConfigurationProperties(prefix = "storage.local")
@Data
public class LocalStorageProperties {
    /**
     * Path to local Directory. Used only for local storage.
     */
    private String directory;
}
