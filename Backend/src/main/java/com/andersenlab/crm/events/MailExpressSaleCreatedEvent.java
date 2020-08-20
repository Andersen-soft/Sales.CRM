package com.andersenlab.crm.events;

import com.andersenlab.crm.model.entities.CompanySale;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MailExpressSaleCreatedEvent {
    CompanySale companySale;
}
