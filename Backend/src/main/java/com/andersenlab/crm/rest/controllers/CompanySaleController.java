package com.andersenlab.crm.rest.controllers;

import com.andersenlab.crm.aop.HasRole;
import com.andersenlab.crm.configuration.swagger.ApiPageable;
import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.model.entities.CompanySale;
import com.andersenlab.crm.model.view.SaleReport;
import com.andersenlab.crm.rest.BaseResponse;
import com.andersenlab.crm.rest.dto.MailImportSaleRequest;
import com.andersenlab.crm.rest.dto.MailImportSaleResponse;
import com.andersenlab.crm.rest.dto.TelegramDto;
import com.andersenlab.crm.rest.dto.history.HistoryDto;
import com.andersenlab.crm.rest.facade.CompanySaleFacade;
import com.andersenlab.crm.rest.facade.ReportFile;
import com.andersenlab.crm.rest.request.CompanySaleCreateRequest;
import com.andersenlab.crm.rest.request.CompanySaleUpdateRequest;
import com.andersenlab.crm.rest.request.ExpressSaleCreateRequest;
import com.andersenlab.crm.rest.request.ReportRequestFilter;
import com.andersenlab.crm.rest.request.SiteCreateDto;
import com.andersenlab.crm.rest.response.CompanySaleResponse;
import com.andersenlab.crm.rest.response.ExpressSaleResponse;
import com.andersenlab.crm.rest.response.SaleReportCategoryResponse;
import com.andersenlab.crm.rest.response.SaleReportCompanyRecommendationResponse;
import com.andersenlab.crm.rest.response.SaleReportDeliveryDirectorResponse;
import com.andersenlab.crm.rest.response.SaleReportResponse;
import com.andersenlab.crm.rest.response.SaleReportStatusResponse;
import com.andersenlab.crm.rest.response.SaleReportTypeResponse;
import com.andersenlab.crm.rest.response.SourceStatisticResponse;
import com.andersenlab.crm.services.CompanySaleReportService;
import com.andersenlab.crm.services.CompanySaleServiceNew;
import com.andersenlab.crm.services.CompanySaleTempService;
import com.andersenlab.crm.services.distribution.CompanySaleNightDistributionService;
import com.querydsl.core.types.Predicate;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.querydsl.binding.QuerydslPredicate;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpEntity;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import static com.andersenlab.crm.model.RoleEnum.ROLE_HR;
import static com.andersenlab.crm.model.RoleEnum.ROLE_MANAGER;
import static com.andersenlab.crm.model.RoleEnum.ROLE_RM;
import static com.andersenlab.crm.model.RoleEnum.ROLE_SALES;
import static com.andersenlab.crm.model.RoleEnum.ROLE_SALES_HEAD;
import static com.andersenlab.crm.model.RoleEnum.ROLE_SITE;

@RestController
@RequestMapping("/company_sale")
@RequiredArgsConstructor
public class CompanySaleController extends BaseController {

    private final CompanySaleServiceNew companySaleServiceNew;
    private final CompanySaleReportService reportService;
    private final CompanySaleTempService companySaleTempService;
    private final ReportFile reportFile;
    private final CompanySaleFacade companySaleFacade;
    private final ConversionService conversionService;
    private final CompanySaleNightDistributionService nightDistributionService;

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_SALES, ROLE_RM, ROLE_MANAGER, ROLE_HR})
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiPageable
    @ApiOperation(value = "Получение списка продаж с возможностью фильтрации.",
            notes = "Обязательных полей нет\n" +
                    "Возможные фильтры по полям:\n id - id продажи, activities - id активности данной продажи (прим. activities=320)\n" +
                    "company - id компании (прим. company=37156)\n companyName - название компании (прим. companyName=deliverator)\n" +
                    "createDate - дата создания(прим. createDate=2014-05-21T09:20:50)\n createLeadDate - дата создания лида (прим. createLeadDate=2014-08-26T09:53:50)\n" +
                    "description - текст описания (прим. description={\"Primary Address Country\":\"Netherlands (Eindhoven)\"})\n estimationNames - число входящее в id оценки (прим. estimationNames=1)\n" +
                    "estimationRequests - id запроса на оценку (estimationRequests=3)\n excludedStatus  - исключенные статусы(прим. excludedStatus=Лид)\n" +
                    "exported - экспортируемый(прим. exported=true)\n firstActivity - id первой активности (прим. firstActivity=19182)\n" +
                    "histories - id истории(прим. histories=68978)\n isActive - активность (прим. sActive=false)\n  isPastActivity - была ли активность(прим. isPastActivity=false)\n" +
                    "lastActivity - id последней активности(прим. lastActivity=6991)\n mainContact - id главного контакта (прим. mainContact=51202)\n" +
                    "mainContactEmail - емейл главного контакта (прим. mainContactEmail=pierre.bechereau@gmail.com)\n mainContactName -имя главного контакта (прим. mainContactName=Pierre Béchereau)\n" +
                    "mainContactSkype - скайп главного контакта (прим. mainContactSkype=Piyelu)\n nextActivityDate - дата следущей активности (прим. nextActivityDate=2017-02-15T14:36:40 или промежуток nextActivityDate=2017-02-15T14:36:40&nextActivityDate=2018-02-15T14:36:40)\n" +
                    "oldId - старое id (прим. oldId=106411)\n responsible - id ответственного сотрудника(прим. responsible=16)\n  resumeNames - число входящее в id резюме (прим. resumeNames=1)\n" +
                    "resumeRequests - id резюме (прим. resumeRequests=27)\n sale1CProject - id продажи в 1С(прим. sale1CProject=16)\n search - поиск по данной строке(по всем полям прим. search=Администратор)\n" +
                    "socialContact - id социального контакта(прим. socialContact=8)\n status - статус продажи (прим. status=Архив)\n " +
                    "statusChangedDate - дата изменения статуса(прим. statusChangedDate=2017-02-15T14:36:40 или промежуток statusChangedDate=2013-02-15T14:36:40&statusChangedDate=2022-02-15T14:36:40)\n" +
                    "type - Тип заявки на продажу(прим. type=Отсутствует)\n weight - вес продажи (прим. weight=56)\n" +
                    "Задание параметров отображения результата:\n page - номер страницы результатов (прим. page=9)\n" +
                    "size - количество записей на странице (прим. size=13)\n sort - сортировка (прим. sort=id,desc)")
    public BaseResponse<Page<CompanySaleResponse>> get(
            @QuerydslPredicate(root = CompanySale.class) Predicate predicate,
            Pageable pageable
    ) {
        return new BaseResponse<>(companySaleFacade.getCompanySales(predicate, pageable));
    }

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_SALES})
    @PostMapping("/create_sale")
    @ApiOperation(value = "Cоздаёт и сохраняет в БД активность и возращает её id.",
            notes = "Входящих фильтрующих полей нет.")
    public BaseResponse<Long> createSale(@RequestBody @Valid CompanySaleCreateRequest request) {
        return new BaseResponse<>(companySaleFacade.createCompanySale(request));
    }

    @HasRole(roles = {ROLE_SITE})
    @PostMapping("/import_sale")
    @ApiOperation(value = "Cоздаёт и сохраняет в БД продажу с активностью" +
            "исходя из полученных данных проекта Site Andersen",
            notes = "Входящих фильтрующих полей нет.")
    public BaseResponse<Long> importAndCreateSale(@RequestBody @Valid SiteCreateDto siteRequest) {
        return new BaseResponse<>(companySaleFacade.importCompanySaleFromSite(siteRequest));
    }

    @PostMapping("/express_sale")
    @ApiOperation(value = "Cоздаёт и сохраняет в БД экспресс-продажу с активностью",
            notes = "Входящих фильтрующих полей нет.")
    public BaseResponse<ExpressSaleResponse> createExpressSale(@RequestBody @Valid ExpressSaleCreateRequest request) {
        return new BaseResponse<>(companySaleFacade.createExpressSale(request));
    }

    @PostMapping("/mail_express_sale")
    @ApiOperation(value = "Cоздаёт и сохраняет в БД экспресс-продажу с активностью",
            notes = "Публичный эндпоинт для создания продажи через общий e-mail.")
    public BaseResponse<ExpressSaleResponse> createExpressSaleByEmail(@RequestBody @Valid ExpressSaleCreateRequest request) {
        return new BaseResponse<>(companySaleFacade.createExpressSaleByMail(request));
    }

    @HasRole(roles = {ROLE_SITE})
    @PostMapping("/mail_import_sale")
    @ApiOperation(value = "Создает и сохраняет в БД продажу по имеющимся данным, которые пришли с почтового сервера.",
            notes = "Доступен для CRM бота.")
    public BaseResponse<MailImportSaleResponse> importSaleByEmail(@RequestBody @Valid MailImportSaleRequest request) {
        return new BaseResponse<>(companySaleFacade.importCompanySaleFromMail(request));
    }

    @HasRole(roles = {ROLE_SITE})
    @PostMapping("/telegram_sale")
    public BaseResponse<Long> importTelegramSales(@RequestBody @Valid TelegramDto telegramDto) {
        return new BaseResponse<>(nightDistributionService.onEmployeeLikeForTelegramSale(telegramDto));
    }

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_SALES, ROLE_HR, ROLE_MANAGER, ROLE_RM, ROLE_SITE})
    @GetMapping("/get_sale")
    @ApiOperation(value = "Получение продажи по id",
            notes = "id - обязательное поле(прим. id=1)")
    public BaseResponse<CompanySaleResponse> getCompanySale(@RequestParam Long id) {
        return new BaseResponse<>(companySaleServiceNew.getCompanySaleResponseById(id));
    }

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_MANAGER, ROLE_RM, ROLE_SALES, ROLE_HR})
    @GetMapping("/{id}/history")
    @ApiOperation(value = "Получение истории событий для продажи по id",
            notes = "id - обязательное поле(прим. id=1)")
    public BaseResponse<List<HistoryDto>> getCompanySaleHistory(@PathVariable("id") Long id, Locale locale) {
        return new BaseResponse<>(companySaleServiceNew.getCompanySaleHistoryById(id, locale));
    }

    @GetMapping("/get_statuses")
    @ApiOperation(value = "Получение списка возможных статусов продаж",
            notes = "Входящих полей нет.")
    public BaseResponse<List<String>> getSaleStatuses() {
        return new BaseResponse<>(companySaleServiceNew.getStatuses());
    }

    @GetMapping("/get_categories")
    @ApiOperation(value = "Получение списка возможных категорий продаж")
    public BaseResponse<List<String>> getSaleCategories() {
        return new BaseResponse<>(companySaleFacade.getCategories());
    }

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_SALES})
    @GetMapping("/get_report_statuses")
    @ApiOperation(value = "Получение статусов отчетов о продажах с возможностью фильтрации.",
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
    public BaseResponse<Page<SaleReportStatusResponse>> getSaleReportStatuses(
            @QuerydslPredicate(root = SaleReport.class) Predicate predicate,
            Pageable pageable,
            Locale locale) {
        return new BaseResponse<>(reportService.getReportStatuses(predicate, pageable, locale));
    }

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_SALES})
    @PutMapping("/update_sale")
    @ApiOperation(value = "Изменение продажи и перезапись её в БД",
            notes = "id - обязательное поле (прим. id=22359).")
    public BaseResponse updateCompanySale(@RequestParam Long id, @RequestBody @Valid CompanySaleUpdateRequest request) {
        companySaleFacade.updateCompanySale(id, request);
        return new BaseResponse<>();
    }

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_SALES})
    @PostMapping("/{id}/approve_sale")
    @ApiOperation(value = "Аппрув продажи, на которую распределяется пользователь")
    public BaseResponse approveAutoDistributionCompanySale(@PathVariable("id") Long companySaleId) {
        companySaleTempService.acceptDistributionSale(companySaleId);
        return new BaseResponse<>();
    }

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_SALES})
    @DeleteMapping("/delete_sale")
    @ApiOperation(value = "Удаление продажи по id",
            notes = "id - обязательное поле (прим. id=2).")
    public BaseResponse deleteSaleById(@RequestParam Long id) {
        companySaleServiceNew.deleteCompanySale(id);
        return new BaseResponse<>();
    }

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_SALES})
    @GetMapping("/get_authorized_user_sales_with_past_activities_count")
    @ApiOperation(value = "Получение количество продаж компании для текущего пользователя",
            notes = "Входящих полей нет.")
    public BaseResponse<Long> getCompanySalesWithFilterOfCurrentUserPastActivities() {
        return new BaseResponse<>(companySaleServiceNew.getCompanySalesWithPastActivitiesCount()
        );
    }

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_SALES})
    @GetMapping("/get_sales_count_by_statuses")
    @ApiOperation(value = "Получение счетчика продаж по статусам, для текущего пользователя",
            notes = "Входящих полей нет.")
    public BaseResponse<Map<String, String>> getSalesCountByStatuses() {
        return new BaseResponse<>(companySaleServiceNew.getSalesCountByStatuses());
    }

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_SALES})
    @GetMapping(value = "/reports", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiPageable
    @ApiOperation(value = "Получение списка отчётов по продажам с возможностью фильтрации.",
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
    public BaseResponse<Page<SaleReportResponse>> getReports(
            @QuerydslPredicate(root = SaleReport.class) Predicate predicate,
            Pageable pageable,
            Locale locale
    ) {
        return new BaseResponse<>(conversionService.convertToPageWithLocale(
                pageable, reportService.getCompanySaleReports(predicate, pageable), SaleReportResponse.class, locale));
    }

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_SALES})
    @GetMapping("/get_stat")
    @ApiOperation(value = "Отображение отчётов, за выбранный период времени",
            notes = "creationFrom и creationTo - обязательные поля(в формате - \"yyyy-MM-dd\").\n" +
                    "(прим. creationFrom=2018-06-12&creationTo=2019-07-30)")
    public BaseResponse<SourceStatisticResponse> getSourcesStatistic(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate creationFrom,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate creationTo,
            Locale locale
    ) {
        return new BaseResponse<>(reportService.getSourcesStatisticWithLocale(creationFrom, creationTo, locale));
    }

    @HasRole(roles = {ROLE_SALES_HEAD})
    @PostMapping(value = "/reports/download", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @ApiOperation(value = "Выгрузка отчётов по продажам в CSV, с возможностью фильтрации",
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
    public HttpEntity<byte[]> downloadReports(
            @QuerydslPredicate(root = SaleReport.class) Predicate predicate,
            @RequestBody(required = false) ReportRequestFilter filter
    ) {
        byte[] document = reportFile.getReport(predicate, filter);
        return new HttpEntity<>(document, defineHttpHeadersDownload("leads_report.csv"));
    }

    @GetMapping("/get_report_types")
    @ApiOperation(value = "Получение списка типов отчетов о продажах, с возможностью фильтрации",
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
    public BaseResponse<Page<SaleReportTypeResponse>> getSaleReportTypes(
            @QuerydslPredicate(root = SaleReport.class) Predicate predicate,
            Pageable pageable,
            Locale locale) {
        return new BaseResponse<>(reportService.getReportTypes(predicate, pageable, locale));
    }

    @GetMapping("/get_sale_categories")
    @ApiOperation(value = "Получение категорий продаж, с возможностью фильтрации",
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
    public BaseResponse<Page<SaleReportCategoryResponse>> getSaleReportCategories(
            @QuerydslPredicate(root = SaleReport.class) Predicate predicate,
            Pageable pageable) {
        return new BaseResponse<>(reportService.getReportCategories(predicate, pageable));
    }

    @GetMapping("/get_report_recommendations")
    public BaseResponse<Page<SaleReportCompanyRecommendationResponse>> getSaleReportRecommendations(
            @QuerydslPredicate(root = SaleReport.class) Predicate predicate,
            Pageable pageable
    ) {
        return new BaseResponse<>(reportService.getCompanyRecommendationsForSaleReport(predicate, pageable));
    }

    @GetMapping("/get_report_dds")
    public BaseResponse<Page<SaleReportDeliveryDirectorResponse>> getSaleReportDeliveryDirectors(
            @QuerydslPredicate(root = SaleReport.class) Predicate predicate,
            Pageable pageable
    ) {
        return new BaseResponse<>(reportService.getDeliveryDirectorsForSaleReport(predicate, pageable));
    }
}
