package com.andersenlab.crm.rest.dto;

import com.andersenlab.crm.rest.response.CountryDto;
import com.andersenlab.crm.rest.response.EmployeeDto;
import com.andersenlab.crm.rest.response.SourceDto;
import lombok.Data;

import java.util.HashSet;
import java.util.Set;

@Data
public class ReportFilterDto {

    private Set<EmployeeDto> responsible = new HashSet<>();
    private Set<SourceDto> sources = new HashSet<>();
    private Set<String> statuses = new HashSet<>();
    private Set<Long> weights = new HashSet<>();
    private Set<CountryDto> countries = new HashSet<>();

    public void addResponsible(EmployeeDto value) {
        this.responsible.add(value);
    }

    public void addSource(SourceDto value) {
        this.sources.add(value);
    }

    public void addStatus(String value) {
        this.statuses.add(value);
    }

    public void addWeight(Long value) {
        this.weights.add(value);
    }

    public void addCountry(CountryDto value) {
        this.countries.add(value);
    }


}
