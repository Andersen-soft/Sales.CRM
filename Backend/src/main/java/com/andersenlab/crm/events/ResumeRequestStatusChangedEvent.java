package com.andersenlab.crm.events;


import com.andersenlab.crm.model.entities.ResumeRequest;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResumeRequestStatusChangedEvent {
    Long resumeRequestId;
    ResumeRequest.Status newStatus;
}
