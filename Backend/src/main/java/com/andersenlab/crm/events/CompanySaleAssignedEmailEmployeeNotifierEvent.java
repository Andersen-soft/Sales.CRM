package com.andersenlab.crm.events;

import com.andersenlab.crm.model.entities.Employee;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanySaleAssignedEmailEmployeeNotifierEvent {
    private Employee responsibleTo;
    private String companyName;
    private String salesUrl;
    private boolean isAutoChange;
    private Employee responsibleFrom;
    private String userEmail;
    private String userLocale;
}
