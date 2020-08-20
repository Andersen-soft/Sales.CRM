package com.andersenlab.crm.services;

import com.andersenlab.crm.exceptions.CrmException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.MessagingException;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.util.function.Consumer;

/**
 * WsSender sends any type payload to the given topic.
 *
 * @author Roman_Haida
 * 30.07.2019
 */
@Component
@Slf4j
@RequiredArgsConstructor
public class WsSender {
    private final SimpMessagingTemplate template;
    private final ObjectMapper mapper;

    public <T> Consumer<T> getSender(String topic) {

        return (T payload) -> {
            String value;

            try {
                value = mapper.writeValueAsString(payload);
            } catch (JsonProcessingException e) {
                throw new CrmException(e);
            }

            try {
                template.convertAndSend(topic, value);
            } catch (MessagingException e) {
                log.warn("Failed message conversion.", e);
            }
        };
    }
}
