package com.andersenlab.crm.rest.response;

import com.andersenlab.crm.rest.sample.EmployeeSample;
import com.andersenlab.crm.rest.sample.ResumeSample;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Contains saleObjectId request information.
 */
@Data
public class ResumeRequestResponse {
    private Long id;
    private Long oldId;
    private String name;
    private LocalDate deadLine;
    private LocalDateTime startAt;
    private Boolean isActive;
    private String companyName;
    private String priority;
    private String status;
    private EmployeeSample responsibleForRequest;
    private EmployeeSample responsibleRm;
    private Boolean isFavorite;
    private List<ResumeSample> resumes;
    private Long saleId;
}
