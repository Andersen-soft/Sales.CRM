package com.andersenlab.crm.services.impl;

import com.andersenlab.crm.configuration.properties.SkypeProperties;
import com.andersenlab.crm.services.BatchSender;
import com.andersenlab.crm.services.SingleSender;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import javax.annotation.PostConstruct;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class SkypeBotSender implements BatchSender, SingleSender {

    private String token;
    private LocalDateTime expires;

    private final SkypeProperties skypeProperties;

    private final RestTemplate restTemplate;

    @Autowired
    @Lazy
    private SkypeBotSender sender;

    @PostConstruct
    private void postConstruct() {
        defineToken();
        expires = LocalDateTime.now();
    }

    @Override
    @Async
    public void sendBatch(String to, String subject, List<String> bodies) {
        bodies.forEach(body -> sender.send(to, subject, body));
    }

    private void defineToken() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.setCacheControl("no-cache");

        MultiValueMap<String, String> requestBody = new LinkedMultiValueMap<>();
        requestBody.add("client_id", skypeProperties.getClient().getId());
        requestBody.add("client_secret", skypeProperties.getClient().getSecret());
        requestBody.add("grant_type", skypeProperties.getGrandType());
        requestBody.add("scope", skypeProperties.getScope());

        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(skypeProperties.getTokenUrl(), HttpMethod.POST, entity, Map.class);
            if (response.getStatusCode() != HttpStatus.OK) {
                log.error("Error in retrieving skype token");
            } else {
                if (response.getBody().containsKey("access_token")) {
                    token = (String) response.getBody().get("access_token");
                    expires = LocalDateTime.now().plusSeconds((Integer) response.getBody().get("ext_expires_in"));
                }
            }
        } catch (HttpStatusCodeException e) {
            log.error("Error in retrieving skype token");
        }
    }

    @Override
    @Async
    public void send(String to, String subject, String body) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.TEXT_PLAIN);
        headers.set("Authorization", "Bearer " + token);

        JSONObject requestBody = new JSONObject();
        requestBody.put("text", body);
        requestBody.put("type", "message");

        HttpEntity<String> entity = new HttpEntity<>(requestBody.toString(), headers);

        try {
            restTemplate.exchange(String.format(skypeProperties.getApiUrl(), to), HttpMethod.POST, entity, Map.class);
            restTemplate.postForEntity(skypeProperties.getApiUrl(), entity, String.class);
        } catch (HttpStatusCodeException e) {
            log.error("Message sending failed.",e);
            if (e.getStatusCode() == HttpStatus.UNAUTHORIZED && expires.isBefore(LocalDateTime.now())) {
                log.info("Try to refresh token.");
                defineToken();
                headers.set("Authorization", "Bearer " + token);
                entity = new HttpEntity<>(requestBody.toString(), headers);
                restTemplate.exchange(String.format(skypeProperties.getApiUrl(), to), HttpMethod.POST, entity, Map.class);
            } else if (!e.getStatusCode().is2xxSuccessful()) {
                log.error("Error in send skype message.");
            }
        }
    }
}

