package com.andersenlab.crm.rest.response;

import com.andersenlab.crm.annotations.ReportColumn;
import com.andersenlab.crm.rest.dto.file.FileDto;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

/**
 * @author Yevhenii Pshenychnyi
 */
@Data
public class EstimationRequestResponse {
    @ReportColumn("Id запроса")
    private Long id;
    @ReportColumn("Имя запроса")
    private String name;
    private CompanyResponse company;
    @ReportColumn("Компания")
    private String companyName;
    @ReportColumn("Статус")
    private String status;
    @ReportColumn("Дедлайн")
    private LocalDate deadline;
    @ReportColumn("Ответственный за оценку")
    private EmployeeResponse responsibleForRequest;
    @ReportColumn("Дата создания")
    private LocalDate createDate;
    @ReportColumn("Продажа")
    private Long saleId;
    private Boolean isActive;
    private List<FileDto> estimations;
    private EmployeeResponse responsibleForSaleRequest;
}
