package com.andersenlab.crm.configuration;

import com.andersenlab.crm.converter.StringToEnumConverterFactory;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.format.FormatterRegistry;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.datetime.DateFormatter;
import org.springframework.format.datetime.DateFormatterRegistrar;
import org.springframework.format.datetime.standard.DateTimeFormatterRegistrar;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;

@Configuration
@AllArgsConstructor
public class WebConfig extends WebMvcConfigurerAdapter {
    private final StringToEnumConverterFactory factory;

    @Override
    public void addFormatters(FormatterRegistry registry) {
        registry.addConverterFactory(factory);
        DateFormatter javaUtilDateFormatter = new DateFormatter();
        javaUtilDateFormatter.setIso(DateTimeFormat.ISO.DATE_TIME);
        DateTimeFormatter jsr310Formatter = DateTimeFormatter.ISO_DATE_TIME;
        DateFormatterRegistrar javaUtilDate = new DateFormatterRegistrar();
        javaUtilDate.setFormatter(javaUtilDateFormatter);
        javaUtilDate.registerFormatters(registry);
        DateTimeFormatterRegistrar jsr310 = new DateTimeFormatterRegistrar();
        jsr310.setDateTimeFormatter(jsr310Formatter);
        jsr310.setDateFormatter(jsr310Formatter);
        jsr310.setTimeFormatter(jsr310Formatter);
        jsr310.registerFormatters(registry);
    }

    @Bean
    @Primary
    public ObjectMapper objectMapper(Jackson2ObjectMapperBuilder builder) {
        ObjectMapper objectMapper = builder.createXmlMapper(false).build();
        objectMapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
        objectMapper.registerModule(new JavaTimeModule());
        return objectMapper;
    }

    @Bean
    public RestTemplate restTemplate() {
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.getMessageConverters()
                .add(0, new StringHttpMessageConverter(StandardCharsets.UTF_8));
        return restTemplate;
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedMethods("HEAD", "GET", "PUT", "POST", "DELETE", "PATCH", "OPTIONS");
    }
}
