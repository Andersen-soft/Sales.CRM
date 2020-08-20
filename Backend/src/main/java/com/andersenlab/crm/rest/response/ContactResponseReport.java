package com.andersenlab.crm.rest.response;

import com.andersenlab.crm.annotations.ReportColumn;
import lombok.Data;

@Data
public class ContactResponseReport {
    @ReportColumn("Имя")
    private String firstName;
    @ReportColumn("Фамилия")
    private String lastName;
    @ReportColumn("Дата рождения")
    private String dateOfBirth;
    @ReportColumn("Компания")
    private String company;
    @ReportColumn("Должность")
    private String position;
    @ReportColumn("e-mail рабочий")
    private String email;
    @ReportColumn("Skype")
    private String skype;
    @ReportColumn("Соцсеть")
    private String socialNetwork;
    @ReportColumn("Контакт соцсети")
    private String socialNetworkUser;
    @ReportColumn("Телефон")
    private String phone;
    @ReportColumn("e-mail личный")
    private String personalEmail;
    @ReportColumn("Страна")
    private String country;
    @ReportColumn("Пол")
    private String sex;
    @ReportColumn("Источник")
    private String source;
    @ReportColumn("Основной контакт")
    private String mainContact;
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
}
