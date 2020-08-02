package com.andersenlab.crm.events;

import com.andersenlab.crm.model.entities.Resume;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResumeStatusChangedEvent {
    Long resumeId;
    Resume.Status newStatus;
}
