package com.andersenlab.crm.rest.dto;

import com.andersenlab.crm.validation.NullOrNotBlank;
import lombok.Data;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

@Data
public class MailImportSaleRequest {
    @NotBlank
    private String sender;

    @NotBlank
    @Email
    private String receiver;

    @NullOrNotBlank
    private String body;
}
