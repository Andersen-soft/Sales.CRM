package com.andersenlab.crm.rest.sample;

import lombok.Data;

import java.time.LocalDate;

@Data
public class SaleRequestSample {
    private Long id;
    private LocalDate deadline;
    private Boolean isActive;
    private Boolean isFavorite;
    private EmployeeSample responsibleRm;
    private String description;
    private String status;
    private String type;
    private SaleObjects saleObjects;

    @Data
    public static class SaleObjects {
        private final long inProgress;
        private final long newObjects;
    }
}
