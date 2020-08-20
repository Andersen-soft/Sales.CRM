package com.andersenlab.crm.events;

import com.andersenlab.crm.model.entities.CompanySale;
import com.andersenlab.crm.model.entities.Employee;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CompanySaleArchivedEvent {
    private Employee whoArchived;
    private CompanySale companySale;
}
