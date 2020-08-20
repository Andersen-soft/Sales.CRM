package com.andersenlab.crm.configuration.properties;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "ldap")
@Getter
@Setter
public class LdapProperties {

    private boolean enable;
    private String url;
    private Integer port;
    private String login;
    private String password;
    private String ntNamePrefix;
}
