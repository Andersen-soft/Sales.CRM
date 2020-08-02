package com.andersenlab.crm.rest.response;

import com.andersenlab.crm.annotations.ReportColumn;
import lombok.Data;

@Data
public class CompanyResponseReport {
    @ReportColumn("Компания")
    private String name;
    @ReportColumn("Сайт")
    private String url;
    @ReportColumn("Телефон")
    private String phone;
    @ReportColumn("Прелид")
    private String preLead;
    @ReportColumn("Лид")
    private String lead;
    @ReportColumn("В работе")
    private String inWork;
    @ReportColumn("Возможность")
    private String opportunity;
    @ReportColumn("Контракт")
    private String contract;
    @ReportColumn("Архив")
    private String archive;
    @ReportColumn("Комментарий")
    private String description;
}
