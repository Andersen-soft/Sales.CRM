package com.andersenlab.crm.listeners;

import com.andersenlab.crm.events.CompanySaleEmployeeNotifierEvent;
import com.andersenlab.crm.services.WsSender;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CompanySaleWebSocketListener {
    private final WsSender wsSender;

    @EventListener
    public void onSaleTimerEvent(CompanySaleEmployeeNotifierEvent event) {
        wsSender.getSender("/topic/company_sale/timer").accept(event);
    }
}
