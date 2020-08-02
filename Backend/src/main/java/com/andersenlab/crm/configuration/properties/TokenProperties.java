package com.andersenlab.crm.configuration.properties;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

@Configuration
@ConfigurationProperties(prefix = "token")
@Getter
@Setter
public class TokenProperties {

    /**
     * Register expiration time in hours
     */
    private long registerExpirationTime;
    /**
     * Refresh expiration time in hours
     */
    private long refreshExpirationTime;
    /**
     * Access expiration time in minutes
     */
    private long accessExpirationTime;
    private char[] accessSecret;
    private char[] refreshSecret;

    public long getRegisterExpirationTimeMillis() {
        return TimeUnit.HOURS.toMillis(this.getRegisterExpirationTime());
    }

    public long getRefreshExpirationTimeMillis() {
        return TimeUnit.HOURS.toMillis(this.getRefreshExpirationTime());
    }

    public long getAccessExpirationTimeMillis() {
        return TimeUnit.MINUTES.toMillis(this.getAccessExpirationTime());
     }


}
