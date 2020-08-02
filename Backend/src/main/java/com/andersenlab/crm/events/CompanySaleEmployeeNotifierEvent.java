package com.andersenlab.crm.events;

import com.andersenlab.crm.rest.dto.TimerNotifierDto;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.context.ApplicationEvent;

@EqualsAndHashCode(callSuper = true)
@Data
public class CompanySaleEmployeeNotifierEvent extends ApplicationEvent {

    public CompanySaleEmployeeNotifierEvent(TimerNotifierDto dto) {
        super(dto);
    }
}
