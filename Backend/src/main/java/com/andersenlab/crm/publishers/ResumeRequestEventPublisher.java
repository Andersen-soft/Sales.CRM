package com.andersenlab.crm.publishers;

import com.andersenlab.crm.events.ResumeRequestCreatedEventNew;
import com.andersenlab.crm.events.ResumeRequestEvent;
import com.andersenlab.crm.model.entities.ResumeRequest;
import com.andersenlab.crm.rest.response.ResumeRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ResumeRequestEventPublisher {

    private final ApplicationEventPublisher applicationEventPublisher;

    public void publishEvent(final ResumeRequestDto dto) {
        ResumeRequestEvent event = new ResumeRequestEvent(this, dto);
        applicationEventPublisher.publishEvent(event);
    }

    public void publishResumeRequestCreatedEvent(ResumeRequest createdRequest) {
        applicationEventPublisher.publishEvent(ResumeRequestCreatedEventNew.builder()
                .createdRequest(createdRequest)
                .build());
    }
}
