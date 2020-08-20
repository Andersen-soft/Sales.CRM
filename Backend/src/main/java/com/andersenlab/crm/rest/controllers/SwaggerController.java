package com.andersenlab.crm.rest.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/swagger")
public class SwaggerController {

    @GetMapping
    public String home() {
        return "redirect:/swagger-ui.html";
    }
}
