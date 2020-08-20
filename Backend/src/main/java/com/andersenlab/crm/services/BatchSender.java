package com.andersenlab.crm.services;

import org.springframework.scheduling.annotation.Async;

import java.util.List;

public interface BatchSender {
    @Async
    void sendBatch(String to, String subject, List<String> bodies);
}
