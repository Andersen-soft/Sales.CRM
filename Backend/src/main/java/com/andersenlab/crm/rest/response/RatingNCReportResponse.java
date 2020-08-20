package com.andersenlab.crm.rest.response;

import com.andersenlab.crm.annotations.ReportColumn;
import lombok.Data;

@Data
public class RatingNCReportResponse {

    @ReportColumn("№")
    private int number;
    @ReportColumn("Координатор")
    private String assistantName;
    @ReportColumn("Всего ответов")
    private String amount;
    @ReportColumn("Принято")
    private String apply;
    @ReportColumn("Отклонено")
    private String reject;
    @ReportColumn("Ожидает")
    private String await;
}
