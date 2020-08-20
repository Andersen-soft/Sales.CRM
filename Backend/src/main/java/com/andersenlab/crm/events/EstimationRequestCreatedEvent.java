package com.andersenlab.crm.events;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class EstimationRequestCreatedEvent {
    Long estimationRequestId;
}
