package com.andersenlab.crm.rest.response;

import com.andersenlab.crm.rest.sample.EmployeeSample;
import com.andersenlab.crm.rest.sample.EstimationRequestSample;
import com.andersenlab.crm.rest.sample.ResumeRequestSample;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class CompanySaleResponse {
    private Long id;
    private EmployeeSample responsible;
    private LocalDateTime createDate;
    private ActivityResponse lastActivity;
    private ActivityResponse firstActivity;
    private LocalDateTime nextActivityDate;
    private String description;
    private ContactResponse mainContact;
    private Long mainContactId;
    private List<ResumeRequestSample> resumes;
    private List<EstimationRequestSample> estimations;
    private String status;
    private CompanyResponse company;
    private Long weight;
    private boolean exported;
    private boolean isSaleApproved;
    private boolean inDayAutoDistribution;
    private Long distributedEmployeeId;
    private SourceResponse source;
    private CompanyResponse recommendation;
    private String category;
}
