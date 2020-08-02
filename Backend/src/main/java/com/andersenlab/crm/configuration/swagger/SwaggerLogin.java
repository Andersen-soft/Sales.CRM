package com.andersenlab.crm.configuration.swagger;

import com.andersenlab.crm.exceptions.CrmException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SwaggerLogin {

    @PostMapping("/login")
    public void swaggerAuth(@RequestBody SwaggerAuth swagerAuth) {
        throw new CrmException("Method from SwaggerConfig invoked!");
    }
}
