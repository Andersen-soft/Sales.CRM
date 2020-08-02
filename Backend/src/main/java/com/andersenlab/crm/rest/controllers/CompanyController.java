package com.andersenlab.crm.rest.controllers;

import com.andersenlab.crm.aop.HasRole;
import com.andersenlab.crm.configuration.swagger.ApiPageable;
import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.model.view.AllResumeRequestsView;
import com.andersenlab.crm.model.view.SaleReport;
import com.andersenlab.crm.rest.BaseResponse;
import com.andersenlab.crm.rest.facade.CompanyFacade;
import com.andersenlab.crm.rest.facade.ReportFile;
import com.andersenlab.crm.rest.request.CompanyCreateRequest;
import com.andersenlab.crm.rest.request.CompanyFilterRequest;
import com.andersenlab.crm.rest.request.CompanyUpdateRequest;
import com.andersenlab.crm.rest.resolvers.CompanyPredicateResolver;
import com.andersenlab.crm.rest.resolvers.CrmPredicate;
import com.andersenlab.crm.rest.response.CompanyResponse;
import com.andersenlab.crm.services.CompanyService;
import com.querydsl.core.types.Predicate;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.querydsl.binding.QuerydslPredicate;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpEntity;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.time.LocalDate;
import java.util.List;

import static com.andersenlab.crm.model.RoleEnum.ROLE_HR;
import static com.andersenlab.crm.model.RoleEnum.ROLE_MANAGER;
import static com.andersenlab.crm.model.RoleEnum.ROLE_NETWORK_COORDINATOR;
import static com.andersenlab.crm.model.RoleEnum.ROLE_RM;
import static com.andersenlab.crm.model.RoleEnum.ROLE_SALES;
import static com.andersenlab.crm.model.RoleEnum.ROLE_SALES_HEAD;

@RequiredArgsConstructor
@RestController
@RequestMapping("/company")
public class CompanyController extends BaseController {

    private final CompanyService companyService;
    private final CompanyFacade companyFacade;
    private final ConversionService conversionService;
    private final ReportFile reportFile;

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_MANAGER, ROLE_RM, ROLE_SALES})
    @PostMapping("/create_company")
    @ApiOperation(value = "Cоздаёт и сохраняет в БД контакт и возращает его id.",
            notes = "Входящих фильтрующих полей нет.")
    public BaseResponse createCompany(@RequestBody @Valid CompanyCreateRequest request) {
        companyService.createCompany(request);
        return new BaseResponse<>();
    }

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_MANAGER, ROLE_RM, ROLE_SALES, ROLE_HR})
    @GetMapping("/get_company")
    @ApiOperation(value = "Получение компании по id",
            notes = "id - обязательное поле (прим. id=1)")
    public BaseResponse<CompanyResponse> getCompany(@RequestParam Long id) {
        return new BaseResponse<>(conversionService.convert(companyService.findCompanyByIdOrThrowException(id), CompanyResponse.class));
    }

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_MANAGER, ROLE_RM, ROLE_SALES, ROLE_NETWORK_COORDINATOR})
    @GetMapping("/get_company_by_name")
    @ApiOperation(value = "Получение компании по имени",
            notes = "name - обязательное поле (прим. name=TP-Link)")
    public BaseResponse<CompanyResponse> getCompany(@RequestParam String name) {
        return new BaseResponse<>(conversionService.convert(
                companyService.findCompanyByName(name), CompanyResponse.class
        ));
    }

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_MANAGER, ROLE_RM, ROLE_SALES, ROLE_NETWORK_COORDINATOR, ROLE_HR})
    @GetMapping("/get_companies")
    @ApiPageable
    @ApiOperation(value = "Получение списка компании с возможностью фильтрации",
            notes = "Обязательных полей нет\n" +
                    "Возможные фильтры по полям:\n name - название компании (прим. name=Кроне Инжиниринг)\n url - сайт компании (прим. url=http://www.ddelivery.ru)\n" +
                    "phone - номер телефона (прим. phone=Королёв)\n createDate - дата создания (прим. createDate=2014-09-18T08:30:47)\n" +
                    "estimationRequest.isEstimationRequestFilter - флаг необходимый для использования фильтров estimationRequest(должен иметь значение estimationRequest.isEstimationRequestFilter=true)\n" +
                    "estimationRequest.name - название запроса на оценку (прим. estimationRequest.name=test13.06)\n" +
                    "estimationRequest.companyId - id компании (прим. companyId=102905)\n" +
                    "estimationRequest.responsibleId - id ответственного сотрудника за запрос (прим. responsibleId=3877)\n" +
                    "estimationRequest.creatorId - id сотрудника создателя запроса (прим. estimationRequest.creatorId=70177)\n" +
                    "estimationRequest.status - статус запроса (Возможен множественный выбор прим. estimationRequest.status=Pending&estimationRequest.status=In progress)\n" +
                    "saleReport.isSaleReportFilter - флаг необходимый для использования фильтров saleReport(должен иметь значение saleReport.isSaleReportFilter=true)\n" +
                    "saleReport.companyName - название компании (Возможен множественный выбор прим. saleReport.companyName=TRUST FRANCE SARL&saleReport.companyName=TP-Link)\n" +
                    "saleReport.countryName - имя страны (Возможен множественный выбор прим. saleReport.countryName=Ukraine&saleReport.countryName=Great Britain)\n" +
                    "saleReport.createLeadDate - дата создания лида (Возможен множественный выбор прим. saleReport.createLeadDate=2015-05-14T12:27:16&saleReport.createLeadDate=2016-08-24T06:38:56)\n " +
                    "saleReport.lastActivityDate - дата последней активности (Возможен множественный выбор прим. saleReport.lastActivityDate=2016-07-08T07:15:04&saleReport.lastActivityDate=2015-09-16T06:59:53)\n" +
                    "saleReport.responsibleId - id ответственного сотрудника (Возможен множественный выбор прим. saleReport.responsibleId=18&saleReport.responsibleId=32)\n" +
                    "saleReport.responsibleName - имя ответственного сотрудника (Возможен множественный выбор прим. saleReport.responsibleName=Сергей Баранов&saleReport.responsibleName=Наталья Геллек)\n" +
                    "saleReport.search - поиск по данной строке(по всем полям прим. saleReport.search=Сергей)\n " +
                    "saleReport.socialContactName - имя социального контакта(Возможен множественный выбор прим. saleReport.socialContactName=Hanna Khimich&saleReport.socialContactName=Alexandr Orlov)\n " +
                    "saleReport.sourceId - id источника(Возможен множественный выбор прим. saleReport.sourceId=3&saleReport.sourceId=5)\n " +
                    "saleReport.sourceName - имя источника(Возможен множественный выбор прим. saleReport.sourceName=Почта&saleReport.sourceName=Звонок)\n " +
                    "saleReport.status - статусы (Возможен множественный выбор прим. saleReport.status=Архив&saleReport.status=Лид)\n" +
                    "saleReport.statusChangedDate - дата изменения статуса (Возможен множественный выбор прим. saleReport.statusChangedDate=2014-10-01T05:54:03&saleReport.statusChangedDate=2014-10-08T09:08:08)\n" +
                    "saleReport.type - тип отчёта (Возможен множественный выбор прим. saleReport.type=Оценка&saleReport.type=Резюме)\n " +
                    "saleReport.weight - вес продажи (Возможен множественный выбор прим. saleReport.weight=5&saleReport.weight=7)\n " +
                    "Задание параметров отображения результата:\n page - номер страницы результатов (прим. page=9)\n" +
                    "size - количество записей на странице (прим. size=13)\n sort - сортировка (прим. sort=id,desc)")
    public BaseResponse<Page<CompanyResponse>> getCompaniesWithFilter(
            @CrmPredicate(resolver = CompanyPredicateResolver.class) Predicate predicate,
            Pageable pageable
    ) {
        return new BaseResponse<>(companyFacade.getCompaniesWithFilter(predicate, pageable));
    }

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_MANAGER, ROLE_RM, ROLE_SALES, ROLE_HR})
    @GetMapping("/get_by_resume_request")
    @ApiPageable
    @ApiOperation(value = "Получение списка компаний с возможностью фильтрации по резюме",
            notes = "Обязательных полей нет\n" +
                    "Возможные фильтры по полям:\n companyId - id компании (прим. companyId=31460)\n companyName - название компании (прим. companyName=Andersen)\n" +
                    "companySaleId - id продажи компании (прим. companySaleId=55308)\n countResume -число резюме (прим. countResume=228)\n " +
                    "createDate - дата создания (прим. createDate=2018-12-22T15:52:55)\n deadline - дата крайнего срока (прим. deadLine=2019-06-04T21:00:00)\n" +
                    "isActive - активные продажи (прим. isActive=true)\n lastActiveDate - дата последней активности (прим. lastActiveDate=2019-03-04T19:31:24)\n " +
                    "name - название запроса продажи (прим. name=3 Senior Python dev, 1 Senior iOS dev)\n responsibleId - id ответственного сотрудника за резюме (прим. responsibleId=213)\n" +
                    "responsible - ответственный сотрудник за резюме (прим. responsible=Александр Григорьев)\n responsibleForSaleRequestId - id ответственного сотрудника за продажу(прим. responsibleForSaleRequestId=18)\n " +
                    "responsibleForSaleRequestName - ответственный сотрудник за продажу(прим. responsibleForSaleRequestName=Юлия Юрченко)\n resumeRequestId - id запроса на резюме (прим. resumeRequestId=3837)\n" +
                    "returnsResumeCount - количеством резюме в компании(прим. returnsResumeCount=27)\n status - статус резюме (прим. status=HR Need)\n " +
                    "Задание параметров отображения результата:\n page - номер страницы результатов (прим. page=9)\n" +
                    "size - количество записей на странице (прим. size=13)\n sort - сортировка (прим. sort=id,desc)")
    public BaseResponse<List<CompanyResponse>> getCompaniesWithFilterByResumeRequest(@QuerydslPredicate(root = AllResumeRequestsView.class) Predicate predicate,
                                                                                     Pageable pageable) {
        return new BaseResponse<>(companyFacade.getCompaniesWithFilterByResumeRequestView(predicate, pageable));
    }

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_SALES})
    @PutMapping("/update_company")
    @ApiOperation(value = "Изменение информации о компании и перезапись её в БД",
            notes = "id - обязательное поле (прим. id=573).")
    public BaseResponse updateCompany(@RequestParam Long id,
                                      @RequestBody CompanyUpdateRequest request) {
        companyService.updateCompany(id, request);
        return new BaseResponse<>();
    }

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_MANAGER, ROLE_RM, ROLE_SALES, ROLE_NETWORK_COORDINATOR, ROLE_HR})
    @GetMapping("/name_filter")
    public BaseResponse<Page<CompanyResponse>> getCompaniesByNameFilter(
            @RequestParam String filter, Pageable pageable) {
        Page<CompanyResponse> result = companyFacade.getCompaniesByNameFilter(filter, pageable);
        return new BaseResponse<>(result);
    }

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_MANAGER, ROLE_RM, ROLE_SALES, ROLE_NETWORK_COORDINATOR, ROLE_HR})
    @GetMapping("/get_companies_sorted_by_name")
    @ApiPageable
    @ApiOperation(value = "Получение списка компании по имени",
            notes = "Обязательных полей нет\n" +
                    "Возможные фильтры по полям:\n name - название компании (прим. name=Кроне Инжиниринг)\n url - сайт компании (прим. url=http://www.ddelivery.ru)\n" +
                    "phone - номер телефона (прим. phone=Королёв)\n createDate - дата создания (прим. createDate=2014-09-18T08:30:47)\n" +
                    "estimationRequest.isEstimationRequestFilter - флаг необходимый для использования фильтров estimationRequest(должен иметь значение estimationRequest.isEstimationRequestFilter=true)\n" +
                    "estimationRequest.name - название запроса на оценку (прим. estimationRequest.name=test13.06)\n" +
                    "estimationRequest.companyId - id компании (прим. companyId=102905)\n" +
                    "estimationRequest.responsibleId - id ответственного сотрудника за запрос (прим. responsibleId=3877)\n" +
                    "estimationRequest.creatorId - id сотрудника создателя запроса (прим. estimationRequest.creatorId=70177)\n" +
                    "estimationRequest.status - статус запроса (Возможен множественный выбор прим. estimationRequest.status=Pending&estimationRequest.status=In progress)\n" +
                    "saleReport.isSaleReportFilter - флаг необходимый для использования фильтров saleReport(должен иметь значение saleReport.isSaleReportFilter=true)\n" +
                    "saleReport.companyName - название компании (Возможен множественный выбор прим. saleReport.companyName=TRUST FRANCE SARL&saleReport.companyName=TP-Link)\n" +
                    "saleReport.countryName - имя страны (Возможен множественный выбор прим. saleReport.countryName=Ukraine&saleReport.countryName=Great Britain)\n" +
                    "saleReport.createLeadDate - дата создания лида (Возможен множественный выбор прим. saleReport.createLeadDate=2015-05-14T12:27:16&saleReport.createLeadDate=2016-08-24T06:38:56)\n " +
                    "saleReport.lastActivityDate - дата последней активности (Возможен множественный выбор прим. saleReport.lastActivityDate=2016-07-08T07:15:04&saleReport.lastActivityDate=2015-09-16T06:59:53)\n" +
                    "saleReport.responsibleId - id ответственного сотрудника (Возможен множественный выбор прим. saleReport.responsibleId=18&saleReport.responsibleId=32)\n" +
                    "saleReport.responsibleName - имя ответственного сотрудника (Возможен множественный выбор прим. saleReport.responsibleName=Сергей Баранов&saleReport.responsibleName=Наталья Геллек)\n" +
                    "saleReport.search - поиск по данной строке(по всем полям прим. saleReport.search=Сергей)\n " +
                    "saleReport.socialContactName - имя социального контакта(Возможен множественный выбор прим. saleReport.socialContactName=Hanna Khimich&saleReport.socialContactName=Alexandr Orlov)\n " +
                    "saleReport.sourceId - id источника(Возможен множественный выбор прим. saleReport.sourceId=3&saleReport.sourceId=5)\n " +
                    "saleReport.sourceName - имя источника(Возможен множественный выбор прим. saleReport.sourceName=Почта&saleReport.sourceName=Звонок)\n " +
                    "saleReport.status - статусы (Возможен множественный выбор прим. saleReport.status=Архив&saleReport.status=Лид)\n" +
                    "saleReport.statusChangedDate - дата изменения статуса (Возможен множественный выбор прим. saleReport.statusChangedDate=2014-10-01T05:54:03&saleReport.statusChangedDate=2014-10-08T09:08:08)\n" +
                    "saleReport.type - тип отчёта (Возможен множественный выбор прим. saleReport.type=Оценка&saleReport.type=Резюме)\n " +
                    "saleReport.weight - вес продажи (Возможен множественный выбор прим. saleReport.weight=5&saleReport.weight=7)\n " +
                    "Задание параметров отображения результата:\n page - номер страницы результатов (прим. page=9)\n" +
                    "size - количество записей на странице (прим. size=13)\n sort - сортировка (прим. sort=id,desc)")
    public BaseResponse<Page<CompanyResponse>> getCompaniesForGlobalSearch(
            CompanyFilterRequest filterRequest, Pageable pageable, String isFullCompanyInfo) {
        return new BaseResponse<>(companyFacade.getCompaniesForGlobalSearch(filterRequest, pageable, Boolean.parseBoolean(isFullCompanyInfo)));
    }

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_SALES})
    @GetMapping("/get_sale_report_companies")
    @ApiPageable
    @ApiOperation(value = "Получение уникальных значений для фильтра по компаниям в отчёте по лидам",
            notes = "Обязательных полей нет\n" +
                    "Возможные фильтры по полям:\n id - id отчёта (Возможен множественный выбор прим. id=139&id=209)\n companyId - id компании (Возможен множественный выбор прим. companyId=6514&companyId=68)\n companyName - название компании (Возможен множественный выбор прим. companyName=deliverator&companyName=ALPOL)\n" +
                    "companyUrl - сайт компании (Возможен множественный выбор прим. companyUrl=http://www.taxiotra.ru&companyUrl=http://xcom.ru)\n contactPosition - занимаемая должность(Возможен множественный выбор прим. contactPosition=проректор&contactPosition=СOO)\n" +
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
    public BaseResponse<Page<CompanyResponse>> getSaleReportCompanies(
            @QuerydslPredicate(root = SaleReport.class) Predicate predicate,
            Pageable pageable) {
        return new BaseResponse<>(companyFacade.getSaleReportCompanies(predicate, pageable));
    }


    @HasRole(roles = {ROLE_SALES_HEAD})
    @PostMapping(value = "/download", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @ApiOperation(value = "Выгрузка компаний в CSV",
            notes = "Поле(обязательное) \"createDateFrom\" фильтр по дате, использовать в формате \"yyyy-MM-dd\"\n" +
                    "Поле(обязательное) \"createDateTo\" фильтр по дате, использовать в формате \"yyyy-MM-dd\"\n" +
                    "(прим. createDateFrom=2014-03-21&createDateTo=2014-05-21")
    public HttpEntity<byte[]> downloadReport(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate createDateFrom,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate createDateTo
    ) {
        byte[] document = reportFile.getCompanyReport(createDateFrom, createDateTo);
        return new HttpEntity<>(document, defineHttpHeadersDownload("companies_report.csv"));
    }
}
