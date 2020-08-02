package com.andersenlab.crm.model;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class LdapUser {
    private String name;
    private String email;
    private String login;
    private LocalDateTime createDate;
}
