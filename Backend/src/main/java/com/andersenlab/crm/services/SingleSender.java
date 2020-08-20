package com.andersenlab.crm.services;

import org.springframework.scheduling.annotation.Async;

public interface SingleSender {
    @Async
    void send(String to, String subject, String body);
}
