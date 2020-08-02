package com.andersenlab.crm.configuration.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration class representing properties for AmazonS3 storage.
 */

@Configuration
@ConfigurationProperties(prefix = "storage.amazonS3")
@Data
public class S3Properties {
    private String endpointUrl;
    private String bucketName;
    private String prefix;
}
