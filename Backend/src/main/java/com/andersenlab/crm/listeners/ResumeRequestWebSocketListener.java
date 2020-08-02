package com.andersenlab.crm.listeners;

import com.andersenlab.crm.events.ResumeRequestEvent;
import com.andersenlab.crm.services.WsSender;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ResumeRequestWebSocketListener implements ApplicationListener<ResumeRequestEvent> {

    private final WsSender wsSender;

    @Override
    public void onApplicationEvent(ResumeRequestEvent resumeRequestEvent) {
        wsSender.getSender("/topic/resume_request/resume").accept(resumeRequestEvent.getDto());
    }
}
