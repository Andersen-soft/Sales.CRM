package com.andersenlab.crm.model;

import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@Builder
@EqualsAndHashCode(of = "contact")
public class RecipientDto {
    private String fio;
    private String contact;
}
