package com.andersenlab.crm.events;

import com.andersenlab.crm.model.EventType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class EstimationRequestCommentedEvent {
    Long commentId;
    String text;
    EventType eventType;
}
