package com.andersenlab.crm.rest.response;

import com.andersenlab.crm.annotations.ReportColumn;
import com.andersenlab.crm.rest.sample.EmployeeSample;
import lombok.Data;

@Data
public class EstimationRequestReportResponse {
    @ReportColumn("Id запроса")
    private Long id;
    @ReportColumn("Имя запроса")
    private String name;
    @ReportColumn("Компания")
    private String companyName;
    @ReportColumn("Статус")
    private String status;
    @ReportColumn("Дедлайн")
    private String deadline;
    @ReportColumn("Ответственный за оценку")
    private EmployeeSample responsibleForRequest;
    @ReportColumn("Дата создания")
    private String createDate;
    @ReportColumn("Ответственный")
    private EmployeeSample responsibleForSaleRequest;
    @ReportColumn("Продажа")
    private String saleId;
}
