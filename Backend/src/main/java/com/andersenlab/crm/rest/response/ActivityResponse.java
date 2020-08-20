package com.andersenlab.crm.rest.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ActivityResponse {
    private Long id;
    private String description;
    private String responsibleName;
    private Long responsibleId;
    private List<ContactResponse> contacts;
    private List<ActivityTypeResponse> types;
    private LocalDateTime dateActivity;
    private String companyName;
    private Long companySale;

    @Data
    @AllArgsConstructor
    public static class ContactResponse {
        private Long id;
        private String firstName;
        private String lastName;
    }
}
