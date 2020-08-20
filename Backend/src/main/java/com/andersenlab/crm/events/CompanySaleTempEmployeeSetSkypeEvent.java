package com.andersenlab.crm.events;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanySaleTempEmployeeSetSkypeEvent {
    private Long companySaleTempId;
    private String userName;
}