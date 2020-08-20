package com.andersenlab.crm.events;

import com.andersenlab.crm.model.entities.EstimationRequest;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class EstimationRequestStatusChangedEvent {
    Long estimationRequestId;
    EstimationRequest.Status newStatus;
}
