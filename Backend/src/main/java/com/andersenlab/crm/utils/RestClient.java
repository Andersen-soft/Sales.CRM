package com.andersenlab.crm.utils;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

public class RestClient {

    private RestTemplate rest;
    private HttpHeaders headers;
    private HttpStatus status;

    public RestClient() {
        this.rest = new RestTemplate();
        this.headers = new HttpHeaders();
        headers.add("Content-Type", "application/json");
        headers.add("Accept", "*/*");
    }

    public <T> ResponseEntity<T> get(String uri, Class<T> object) {
        HttpEntity<String> requestEntity = new HttpEntity<>("", headers);
        ResponseEntity<T> responseEntity = rest.exchange(uri, HttpMethod.GET, requestEntity, object);
        this.setStatus(responseEntity.getStatusCode());
        return responseEntity;
    }

    public <T> ResponseEntity<T> post(String uri, String json, Class<T> object) {
        HttpEntity<String> requestEntity = new HttpEntity<>(json, headers);
        ResponseEntity<T> responseEntity = rest.exchange(uri, HttpMethod.POST, requestEntity, object);
        this.setStatus(responseEntity.getStatusCode());
        return responseEntity;
    }

    public <T> ResponseEntity<T> put(String uri, String json, Class<T> object) {
        HttpEntity<String> requestEntity = new HttpEntity<>(json, headers);
        ResponseEntity<T> responseEntity = rest.exchange(uri, HttpMethod.PUT, requestEntity, object);
        this.setStatus(responseEntity.getStatusCode());
        return responseEntity;
    }

    public void delete(String uri) {
        HttpEntity<String> requestEntity = new HttpEntity<>("", headers);
        ResponseEntity<String> responseEntity = rest.exchange(uri, HttpMethod.DELETE, requestEntity, (Class<String>) null);
        this.setStatus(responseEntity.getStatusCode());
    }

    public HttpStatus getStatus() {
        return status;
    }

    public void setStatus(HttpStatus status) {
        this.status = status;
    }
}
