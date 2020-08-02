package com.andersenlab.crm.rest.dto.resumerequest;

import com.andersenlab.crm.annotations.ReportColumn;
import lombok.Data;

@Data
public class ResumeProcessingReportRowDTO {

    @ReportColumn("Запрос на резюме")
    private String requestName;
    @ReportColumn("Компания")
    private String companyName;
    @ReportColumn("Ответственный")
    private String responsibleName;
    @ReportColumn("Ответственный RM")
    private String responsibleRmName;
    @ReportColumn("Ответственный HR")
    private String responsibleHrName;
    @ReportColumn("ФИО кандидата")
    private String fio;
    @ReportColumn("HR Need")
    private String durationHRNeed;
    @ReportColumn("Кол-во проходов через HR Need")
    private String amountHRNeed;
    @ReportColumn("In progress")
    private String durationInProgress;
    @ReportColumn("Кол-во проходов через In progress")
    private String amountInProgress;
    @ReportColumn("CTO Need")
    private String durationCTONeed;
    @ReportColumn("Кол-во проходов через CTO Need")
    private String amountCTONeed;
    @ReportColumn("Done")
    private String durationDone;
    @ReportColumn("Кол-во проходов через Done")
    private String amountDone;
    @ReportColumn("Pending")
    private String durationPending;
    @ReportColumn("Кол-во проходов через Pending")
    private String amountPending;
    @ReportColumn("Общее время")
    private String duration;

}
