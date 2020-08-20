package com.andersenlab.crm.configuration;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CrmLdapConnectionRequest {

    private String url;
    private Integer port;
    private String login;
    private String pass;
}
