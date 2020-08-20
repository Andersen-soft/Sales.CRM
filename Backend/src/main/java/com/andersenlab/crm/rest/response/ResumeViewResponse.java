package com.andersenlab.crm.rest.response;

import com.andersenlab.crm.annotations.ReportColumn;
import com.andersenlab.crm.rest.dto.EmployeeDto;
import com.andersenlab.crm.rest.sample.ResumeRequestSample;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Setter
@Getter
@NoArgsConstructor
public class ResumeViewResponse {
    private Long id;
    private LocalDateTime dateCreated;
    @ReportColumn("Дедлайн")
    private LocalDate deadline;
    @JsonProperty("resumeRequest")
    @ReportColumn("Запрос на резюме")
    private ResumeRequestSample resumeRequestSample;
    @ReportColumn("ФИО кандидата")
    private String fio;
    @ReportColumn("Статус резюме")
    private String status;
    @JsonProperty("responsibleHr")
    @ReportColumn("Ответственный HR")
    private EmployeeDto employeeDto;
    @ReportColumn("Комментарий")
    private String comment;
    private Boolean isUrgent;
}
