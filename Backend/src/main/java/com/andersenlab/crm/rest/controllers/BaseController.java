package com.andersenlab.crm.rest.controllers;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

public class BaseController {

    protected HttpHeaders defineHttpHeadersDownload(String filename) {
        HttpHeaders header = new HttpHeaders();
        header.setContentType(MediaType.valueOf(MediaType.APPLICATION_OCTET_STREAM_VALUE));
        header.set(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=" + filename);
        return header;
    }
}
