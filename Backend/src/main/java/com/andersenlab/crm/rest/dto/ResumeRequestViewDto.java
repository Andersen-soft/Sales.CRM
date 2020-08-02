package com.andersenlab.crm.rest.dto;

import com.andersenlab.crm.annotations.ReportColumn;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ResumeRequestViewDto {
    private Long resumeRequestId;
    @ReportColumn("Запрос на резюме")
    private String name;
    @ReportColumn("Компания")
    private String companyName;
    @ReportColumn("Статус")
    private String status;
    @ReportColumn("Кол-во возвратов CV")
    private BigDecimal returnsResumeCount;
    private LocalDateTime deadline;
    @JsonIgnore
    @ReportColumn("Дедлайн")
    private String stringDeadline;
    @ReportColumn("Отвественный RM")
    private String responsible;
    private Long responsibleId;
    private LocalDateTime createDate;
    @JsonIgnore
    @ReportColumn("Дата создания")
    private String stringCreateDate;
    @ReportColumn("Ответственный")
    private String responsibleForSaleRequestName;
    private Long responsibleForSaleRequestId;
    @ReportColumn("Кол-во резюме")
    private Long countResume;
    private Long companySaleId;
    @JsonIgnore
    @ReportColumn("Продажа")
    private String companySaleLink;
    private Boolean isActive;
}
