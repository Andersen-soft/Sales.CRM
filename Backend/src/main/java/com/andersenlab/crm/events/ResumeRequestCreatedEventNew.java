package com.andersenlab.crm.events;

import com.andersenlab.crm.model.entities.ResumeRequest;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ResumeRequestCreatedEventNew {
    private ResumeRequest createdRequest;
}
