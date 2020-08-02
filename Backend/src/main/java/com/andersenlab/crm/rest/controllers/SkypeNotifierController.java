package com.andersenlab.crm.rest.controllers;

import com.andersenlab.crm.configuration.properties.SkypeProperties;
import com.andersenlab.crm.services.impl.SkypeBotSender;
import com.google.gson.Gson;
import com.microsoft.bot.schema.models.Activity;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/skype")
@Slf4j
public class SkypeNotifierController {
    private final SkypeBotSender sender;
    private final SkypeProperties skypeProperties;

    @PostMapping
    public void getFromSkype(@RequestBody Activity activity) {
        String message = new Gson().newBuilder().enableComplexMapKeySerialization().create().toJson(activity);
        sender.send(skypeProperties.getChat().getEstimation(), "", message);
        log.info(message);
    }
}
