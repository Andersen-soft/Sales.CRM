package com.andersenlab.crm.events;

import org.springframework.context.ApplicationEvent;

public class ResumeStatusChangeListener extends ApplicationEvent{


    /**
     * Create a new ApplicationEvent.
     *
     * @param source the object on which the event initially occurred (never {@code null})
     */
    public ResumeStatusChangeListener(Object source) {
        super(source);
    }
}
