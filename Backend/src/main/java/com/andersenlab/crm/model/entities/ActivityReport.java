package com.andersenlab.crm.model.entities;

import com.andersenlab.crm.annotations.ReportColumn;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ActivityReport {
    @ReportColumn("Сотрудник")
    private String sales;
    private Long salesId;
    @ReportColumn("Звонки")
    private Long call;
    @ReportColumn("Встречи")
    private Long meeting;
    @ReportColumn("Соцсети")
    private Long socialNetwork;
    @ReportColumn("Интервью")
    private Long interview;
    @ReportColumn("Письма")
    private Long email;
    @ReportColumn("Суммарно активностей по продажам")
    private Long sum;
    @ReportColumn("Запросы на резюме")
    private Long resumeRequests;
    @ReportColumn("Запросы на оценку")
    private Long estimationRequests;
}
