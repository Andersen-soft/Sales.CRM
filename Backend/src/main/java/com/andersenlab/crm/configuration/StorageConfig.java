package com.andersenlab.crm.configuration;

import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Config for file storage
 *
 * @author v.pronkin on 30.07.2018
 */
@Configuration
public class StorageConfig {

    @ConditionalOnProperty(
            value = "storage.type",
            havingValue = "amazonS3"
    )
    @Bean
    public AmazonS3 getAmazonS3() {
        return AmazonS3ClientBuilder.standard()
                .withRegion(Regions.EU_CENTRAL_1)
                .build();
    }
}
