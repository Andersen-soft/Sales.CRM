package com.andersenlab.crm.rest.dto;

import com.andersenlab.crm.annotations.ReportColumn;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class SocialNetworkAnswerHeadDto {
    private Long id;
    @ReportColumn("Статус")
    private String status;
    @ReportColumn("Дата создания")
    private String createDate;
    @ReportColumn("Асистент")
    private String assistant;
    private String assistantId;
    @ReportColumn("Менеджер")
    private String responsible;
    private String responsibleId;
    @ReportColumn("Источник")
    private String source;
    @ReportColumn("Контакт соцсети")
    private String socialNetworkContact;
    @ReportColumn("Сообщение")
    private String message;
    @ReportColumn("Соцсеть")
    private String linkLead;
    @ReportColumn("Имя")
    private String firstName;
    @ReportColumn("Фамилия")
    private String lastName;
    @ReportColumn("Пол")
    private String sex;
    @ReportColumn("Страна")
    private String country;
    @ReportColumn("Название компании")
    private String companyName;
}
