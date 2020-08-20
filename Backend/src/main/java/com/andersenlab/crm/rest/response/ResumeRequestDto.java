package com.andersenlab.crm.rest.response;

import com.andersenlab.crm.rest.dto.file.FileDto;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@JsonPropertyOrder({"id", "name", "created", "deadLine", "status", "priority", "saleId",
        "company", "employee", "responsible", "responsibleForSaleRequest", "attachments", "autoDistribution"})
public class ResumeRequestDto {
    private Long id;
    private String name;
    private CompanyResponse company;
    private EmployeeResponse responsible;
    private EmployeeResponse responsibleForSaleRequest;
    private String status;
    private LocalDate deadLine;
    private String priority;
    private Long saleId;
    private LocalDateTime created;
    private List<FileDto> attachments;
    private boolean autoDistribution;
}
