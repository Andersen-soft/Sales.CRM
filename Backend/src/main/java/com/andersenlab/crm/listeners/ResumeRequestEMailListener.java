package com.andersenlab.crm.listeners;

import com.andersenlab.crm.events.ResumeRequestEvent;
import com.andersenlab.crm.notification.ResumeRequestMailNotifier;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ResumeRequestEMailListener implements ApplicationListener<ResumeRequestEvent> {

    private final ResumeRequestMailNotifier resumeRequestMailNotifier;

    @Override
    public void onApplicationEvent(ResumeRequestEvent resumeRequestEvent) {
        resumeRequestMailNotifier.onResponsibleRmChanged(resumeRequestEvent);
    }
}
