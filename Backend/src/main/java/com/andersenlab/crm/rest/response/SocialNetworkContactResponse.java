package com.andersenlab.crm.rest.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SocialNetworkContactResponse {
    private Long id;
    private String name;
    private Long sourceId;
    private String source;
    private Long salesId;
    private String sales;
    private Long salesAssistantId;
    private String salesAssistant;
    private LocalDateTime createDate;
}
