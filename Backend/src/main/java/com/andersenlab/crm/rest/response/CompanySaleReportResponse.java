package com.andersenlab.crm.rest.response;

import com.andersenlab.crm.annotations.ReportColumn;
import lombok.Data;

@Data
public class CompanySaleReportResponse {
    @ReportColumn("Дата создания")
    private String createDate;
    @ReportColumn("Источник")
    private String sourceName;
    @ReportColumn("Референция от")
    private String companyRecommendationName;
    @ReportColumn("Компания")
    private String companyName;

    private String id;
    @ReportColumn("Статус")
    private String status;
    @ReportColumn("Категория")
    private String category;
    @ReportColumn("Изм. статуса")
    private String statusChangedDate;
    @ReportColumn("Delivery Director")
    private String responsibleRmName;
    @ReportColumn("Ответственный")
    private String responsibleName;

    private String lastActivityDate;

    private String weight;
    @ReportColumn("Запрос")
    private String requestType;
    @ReportColumn("Название запросов")
    private String requestNames;
    @ReportColumn("Сайт компании")
    private String companyUrl;
    @ReportColumn("Основной контакт")
    private String mainContact;
    @ReportColumn("Должность")
    private String contactPosition;
    @ReportColumn("Skype")
    private String skype;
    @ReportColumn("E-mail рабочий")
    private String email;
    @ReportColumn("Соц. сеть")
    private String socialNetwork;
    @ReportColumn("Виртуалка")
    private String socialContact;
    @ReportColumn("Телефон")
    private String phone;
    @ReportColumn("E-mail личный")
    private String personalEmail;
    @ReportColumn("Страна")
    private String country;
    @ReportColumn("Домен")
    private String industries;
}
