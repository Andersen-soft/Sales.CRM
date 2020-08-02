package com.andersenlab.crm.events;

import com.andersenlab.crm.rest.response.ResumeRequestDto;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

public class ResumeRequestEvent extends ApplicationEvent {

    @Getter
    private ResumeRequestDto dto;

    public ResumeRequestEvent(Object source, ResumeRequestDto dto) {
        super(source);
        this.dto = dto;
    }
}
