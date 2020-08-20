package com.andersenlab.crm.services;

import org.springframework.scheduling.annotation.Async;

import java.util.Set;

public interface BroadcastSender {
    @Async
    void sendMultiple(Set<String> recipients, String subject, String body);
}
