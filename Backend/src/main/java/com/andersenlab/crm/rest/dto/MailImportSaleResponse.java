package com.andersenlab.crm.rest.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MailImportSaleResponse {
    private Long saleId;
}
