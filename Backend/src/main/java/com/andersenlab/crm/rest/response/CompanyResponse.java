package com.andersenlab.crm.rest.response;

import lombok.Data;

import java.util.List;
import java.util.Set;

@Data
public class CompanyResponse {
    private Long id;
    private String name;
    private String url;
    private Set<Long> linkedSales;
    private String phone;
    private String description;
    private EmployeeResponse responsibleRm;
    private List<IndustryDto> industryDtos;
}
