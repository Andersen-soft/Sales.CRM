package com.andersenlab.crm.rest.controllers;

import com.andersenlab.crm.aop.HasRole;
import com.andersenlab.crm.configuration.swagger.ApiPageable;
import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.model.view.SaleReport;
import com.andersenlab.crm.rest.BaseResponse;
import com.andersenlab.crm.rest.response.IndustryDto;
import com.andersenlab.crm.rest.response.SaleReportIndustryResponse;
import com.andersenlab.crm.services.IndustryService;
import com.querydsl.core.types.Predicate;
import io.swagger.annotations.ApiOperation;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.querydsl.binding.QuerydslPredicate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static com.andersenlab.crm.model.RoleEnum.ROLE_SALES;
import static com.andersenlab.crm.model.RoleEnum.ROLE_SALES_HEAD;

@AllArgsConstructor
@RestController
@RequestMapping(path = "/industry")
public class IndustryController extends BaseController {

    private final IndustryService industryService;
    private final ConversionService conversionService;

    @GetMapping("/get_industries")
    public BaseResponse<List<IndustryDto>> getIndustries() {
        return new BaseResponse<>(conversionService.convertToList(
                industryService.getAllIndustries(), IndustryDto.class));
    }

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_SALES})
    @GetMapping("/get_report_industries")
    @ApiPageable
    @ApiOperation(value = "Получение доменов компании, с возможностью фильтрации",
            notes = "Обязательных полей нет\n" +
                    "Возможные фильтры по полям:\n id - id отчёта (Возможен множественный выбор прим. id=139&id=209)\n companyId - id компании (Возможен множественный выбор прим. companyId=6514&companyId=68)\n companyName - название компании (Возможен множественный выбор прим. companyName=deliverator&companyName=ALPOL)\n" +
                    "companyUrl - сайт компании (Возможен множественный выбор прим. companyUrl=http://www.taxiotra.ru&companyUrl=http://xcom.ru)\n companyIndustries - домены компании (Возможен множественный выбор прим. companyIndustries=Banking&companyIndustries=Gambling)\n contactPosition - занимаемая должность(Возможен множественный выбор прим. contactPosition=проректор&contactPosition=СOO)\n" +
                    "countryId - id страны (Возможен множественный выбор прим. countryId=98&countryId=341)\n countryName - имя страны (Возможен множественный выбор прим. name=Ukraine&name=Great Britain)\n createDate - дата создания продажи (При вводе двух дат будет выбран промежуток прим. createDate=2014-12-17T10:14:20&createDate=2017-08-11T05:52:50)\n" +
                    "createLeadDate - дата создания лида (При вводе двух дат будет выбран промежуток прим. createLeadDate=2014-12-17T10:14:20&createLeadDate=2017-08-11T05:52:50)\n email - емейл контактного лица (Возможные значения: null - все записи с пустым значением поля, notNull - все записи, в которых поле заполнено)\n" +
                    "estimationRequests - запросы оценки (Возможен множественный выбор прим. estimationRequests=3564  VZperformance - Desktop app&estimationRequests=783 Site web/boutique en ligne pour bijoux «sens bons»)\n excludedStatus - исключенные статусы (Возможен множественный выбор прим. excludedStatus=Лид&excludedStatus=Архив)\n" +
                    "lastActivityDate - дата последней активности (Возможен множественный выбор прим. lastActivityDate=2018-11-08T11:30:55&lastActivityDate=2019-04-29T13:51:34)\n mainContact - главный контакт (Возможен множественный выбор прим. mainContact=Aberlt Wu&mainContact=Tanel Hiir)\n " +
                    "personalEmail - личный емейл контактного лица (Возможные значения: null - все записи с пустым значением поля, notNull - все записи, в которых поле заполнено)\n phone - номер телефона (Возможные значения: null - все записи с пустым значением поля, notNull - все записи, в которых поле заполнено)\n responsibleId - id ответственного сотрудника (Возможен множественный выбор прим. responsibleId=25&responsibleId=172)\n" +
                    "responsibleName - имя ответственного сотрудника (Возможен множественный выбор прим. responsibleName=Ярослав Веремейчик&responsibleName=Дмитрий Малиновский)\n resumeRequests - резюме запросов (Возможен множественный выбор прим. resumeRequests=1664 Node.js&resumeRequests=3843 Oxid (PHP))\n " +
                    "search - поиск по данной строке(по всем полям прим. search=Сергей)\n skype - скайп (Возможные значения: null - все записи с пустым значением поля, notNull - все записи, в которых поле заполнено)\n socialContactId - id социального контакта (Возможен множественный выбор прим. socialContactId=17&socialContactId=135)\n" +
                    "socialContactName - имя социального контакта(прим. socialContactName=Hanna Khimich&socialContactName=огонь)\n socialNetwork - социальная сеть(Возможен множественный выбор прим. socialNetwork=https://www.linkedin.com/in/antonklees/&socialNetwork=https://www.linkedin.com/in/matic-hribar-2181b899/)\n" +
                    "sourceId - id источника(Возможен множественный выбор прим. sourceId=3&sourceId=4)\n sourceName - имя источника(Возможен множественный выбор прим. sourceName=Почта&sourceName=Личный контакт)\n status - статусы (Возможен множественный выбор прим. status=Архив&status=Лид)\n " +
                    "statusChangedDate - дата изменения статуса (При вводе двух дат будет выбран промежуток прим. statusChangedDate=2013-03-20T14:54:24&statusChangedDate=2022-08-16T14:41:01)\n statusDate - дата создания статуса (Возможен множественный выбор прим. statusDate=2019-03-20&statusDate=2018-08-29)\n" +
                    "type - тип отчёта (Возможен множественный выбор прим. type=Оценка&type=Резюме/Оценка)\n weight - вес продажи (Возможен множественный выбор прим. weight=5&weight=5)\n " +
                    "Задание параметров отображения результата:\n page - номер страницы результатов (прим. page=9)\n" +
                    "size - количество записей на странице (прим. size=13)\n sort - сортировка (прим. sort=id,desc)")
    public BaseResponse<Page<SaleReportIndustryResponse>> getSaleReportIndustries(
            @QuerydslPredicate(root = SaleReport.class) Predicate predicate, Pageable pageable) {
        return new BaseResponse<>(industryService.findAllBySaleReport(predicate, pageable));
    }
}
