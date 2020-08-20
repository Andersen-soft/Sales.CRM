package com.andersenlab.crm.events;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanySaleEmployeeSetMailEvent {
    private Long saleId;
    private String userName;
    private String userEmail;
    private String companyName;
    private String userLocale;
}