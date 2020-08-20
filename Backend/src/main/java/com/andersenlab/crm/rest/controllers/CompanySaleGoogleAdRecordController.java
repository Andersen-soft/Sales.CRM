package com.andersenlab.crm.rest.controllers;

import com.andersenlab.crm.services.CompanySaleGoogleAdRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/google-ad-record")
@RequiredArgsConstructor
public class CompanySaleGoogleAdRecordController extends BaseController {
    private final CompanySaleGoogleAdRecordService googleAdRecordService;

    @GetMapping("/export")
    public HttpEntity<byte[]> exportGoogleAdRecords() {
        byte[] document = googleAdRecordService.exportRecordsToCSVFile();
        return new HttpEntity<>(document, defineHttpHeadersDownload("leads_report.csv"));
    }
}
