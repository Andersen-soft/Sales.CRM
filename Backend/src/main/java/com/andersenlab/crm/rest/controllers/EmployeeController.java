package com.andersenlab.crm.rest.controllers;

import com.andersenlab.crm.aop.HasRole;
import com.andersenlab.crm.configuration.swagger.ApiPageable;
import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.model.view.SaleReport;
import com.andersenlab.crm.rest.BaseResponse;
import com.andersenlab.crm.rest.dto.EmployeePublicResponse;
import com.andersenlab.crm.rest.request.EmployeeUpdateRequest;
import com.andersenlab.crm.rest.resolvers.CrmPredicate;
import com.andersenlab.crm.rest.resolvers.EmployeePredicateResolver;
import com.andersenlab.crm.rest.response.EmployeeResponse;
import com.andersenlab.crm.rest.response.RoleResponse;
import com.andersenlab.crm.rest.response.SaleReportEmployeeResponse;
import com.andersenlab.crm.services.EmployeeService;
import com.andersenlab.crm.services.RoleService;
import com.querydsl.core.types.Predicate;
import io.swagger.annotations.ApiOperation;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.querydsl.binding.QuerydslPredicate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static com.andersenlab.crm.model.RoleEnum.ROLE_ADMIN;
import static com.andersenlab.crm.model.RoleEnum.ROLE_HR;
import static com.andersenlab.crm.model.RoleEnum.ROLE_MANAGER;
import static com.andersenlab.crm.model.RoleEnum.ROLE_NETWORK_COORDINATOR;
import static com.andersenlab.crm.model.RoleEnum.ROLE_RM;
import static com.andersenlab.crm.model.RoleEnum.ROLE_SALES;
import static com.andersenlab.crm.model.RoleEnum.ROLE_SALES_HEAD;

/**
 * Receives requests related to employees, and delegates them to services.
 * Responds to client with BaseResponse object, that wraps the results of services methods.
 */
@AllArgsConstructor
@RestController
@RequestMapping(path = "/employee")
public class EmployeeController extends BaseController {

    private final EmployeeService employeeService;
    private final RoleService roleService;
    private final ConversionService conversionService;

    @HasRole(roles = {ROLE_ADMIN, ROLE_SALES_HEAD, ROLE_HR, ROLE_MANAGER, ROLE_RM, ROLE_SALES})
    @GetMapping(path = "/get_employees")
    @ApiPageable
    @ApiOperation(value = "Получение списка сотрудников с возможностью фильтрации",
            notes = "Обязательных полей нет\n" +
                    "Возможные фильтры по полям:\n id - id сотрудника (прим. id=1)\n isActive - активность(прим. isActive=true)\n" +
                    "name - имя сотрудника (прим. name=Ксения)\n email - емейл сотрудника(прим. email=user@user.com)\n" +
                    "skype - скайп сотрудника (прим. skype=angelina.korchunova)\n position - занимаемая должность (прим. position=разработчик)\n" +
                    "login - логин сотрудника (прим. login=v.martsinovich)\n role - права доступа сотрудника(прим. role=4)\n lang - язык сотрудника(ru или en)\n" +
                    "estimationRequest.isCreators - флаг(если он null остальные фильтры estimationRequest не работают) поле указывающее из каких сотрудников будет производиться выборка (true - выбрать создателей запроса, false - выбрать ответственных прим. estimationRequest.isCreators=false)\n" +
                    "estimationRequest.creatorId - id создателя запроса (прим. estimationRequest.creatorId=211)\n" +
                    "estimationRequest.responsibleId - id ответственного за запрос (прим. estimationRequest.responsibleId=254)\n" +
                    "estimationRequest.companyId - id компании (прим. estimationRequest.companyId=38469)\n" +
                    "estimationRequest.status - статус запроса (Возможен множественный выбор прим. estimationRequest.status=Approve need&estimationRequest.status=Pending&estimationRequest.isCreators=true)\n" +
                    "estimationRequest.name - название запроса(все названия включающие данную строку прим. estimationRequest.name=.NET)\n" +
                    "для работы фильтров socialAnswer необходимы roles ROLE_SALES или ROLE_NETWORK_COORDINATOR (прим. role=4)\n" +
                    "socialAnswer.status - статусы ответов(Возможен множественный выбор прим. socialAnswer.status=Принято&role=4&socialAnswer.status=Отклонено)\n" +
                    "socialAnswer.createDate - дата создания ответа(Возможен множественный выбор прим. createDate=2019-05-03 07:49:07&createDate=2019-03-22T07:03:51)\n" +
                    "socialAnswer.assistant - id ассисента (прим. socialAnswer.assistant=70002)\n" +
                    "socialAnswer.responsible - id ответственного сотрудника (прим. socialAnswer.responsible=4634)\n" +
                    "socialAnswer.source - id источника(Возможен множественный выбор прим. socialAnswer.source=13&socialAnswer.source=5)" +
                    "socialAnswer.socialContact - id социального контакта (прим. socialAnswer.socialContact=149)\n" +
                    "socialAnswer.country - id странны (прим. socialAnswer.country=36)\n" +
                    "socialAnswer.search - поиск по данной строке (прим. socialAnswer.search=IP Partners)\n" +
                    "saleReport.isSaleReportFilter - флаг необходимый для использования фильтров saleReport(должен иметь значение saleReport.isSaleReportFilter=true)\n" +
                    "saleReport.companyName - название компании (Возможен множественный выбор прим. saleReport.companyName=TRUST FRANCE SARL&saleReport.companyName=TP-Link)\n" +
                    "saleReport.countryName - имя страны (Возможен множественный выбор прим. saleReport.countryName=Ukraine&saleReport.countryName=Great Britain)\n" +
                    "saleReport.createLeadDate - дата создания лида (Возможен множественный выбор прим. saleReport.createLeadDate=2019-07-10T08:26:22&saleReport.createLeadDate=2014-10-08T09:08:09)\n " +
                    "saleReport.lastActivityDate - дата последней активности (Возможен множественный выбор прим. saleReport.lastActivityDate=2014-10-08T07:17:00&saleReport.lastActivityDate=2014-12-01T06:59:04)\n" +
                    "saleReport.responsibleId - id ответственного сотрудника (Возможен множественный выбор прим. saleReport.responsibleId=25&saleReport.responsibleId=36)\n" +
                    "saleReport.responsibleName - имя ответственного сотрудника (Возможен множественный выбор прим. saleReport.responsibleName=Ярослав Веремейчик&saleReport.responsibleName=Анна Ходько)\n" +
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
    public BaseResponse<Page<EmployeeResponse>> getEmployeesWithFilter(
            @CrmPredicate(resolver = EmployeePredicateResolver.class) Predicate predicate,
            Pageable pageable
    ) {
        return new BaseResponse<>(conversionService.convertToPage(
                pageable, employeeService.getEmployeesWithFilter(predicate, pageable), EmployeeResponse.class));
    }

    @GetMapping("/get_for_express_sale")
    public BaseResponse<List<EmployeePublicResponse>> getEmployeesForMailExpressSale() {
        return new BaseResponse<>(conversionService.convertToList(
                employeeService.getForMailExpressSale(), EmployeePublicResponse.class));
    }

    @HasRole(roles = {ROLE_ADMIN, ROLE_SALES_HEAD, ROLE_HR, ROLE_MANAGER, ROLE_RM, ROLE_SALES, ROLE_NETWORK_COORDINATOR})
    @PutMapping(path = "/update_employee")
    @ApiOperation(value = "Изменение информации о сотруднике и перезапись её в БД",
            notes = "id - обязательное поле (прим. id=1).")
    public BaseResponse<EmployeeResponse> updateEmployee(@RequestParam Long id,
                                                         @RequestBody EmployeeUpdateRequest employeeUpdateRequest) {
        return new BaseResponse<>(conversionService.convert(
                employeeService.updateEmployee(id, employeeUpdateRequest), EmployeeResponse.class));
    }

    @HasRole(roles = {ROLE_ADMIN})
    @GetMapping("/get_all_roles")
    @ApiPageable
    @ApiOperation(value = "Получение списка прав доступа сотрудников.",
            notes = "Входящих фильтрующих полей нет.")
    public BaseResponse<List<RoleResponse>> getRoles() {
        return new BaseResponse<>(conversionService.convertToList(roleService.getRoles(), RoleResponse.class));
    }

    @HasRole(roles = {ROLE_ADMIN, ROLE_SALES_HEAD, ROLE_RM, ROLE_SALES, ROLE_HR, ROLE_MANAGER, ROLE_NETWORK_COORDINATOR})
    @GetMapping(path = "/get_employee")
    @ApiOperation(value = "Получение сотрудника по id",
            notes = "id - обязательное поле (прим. id=1)")
    public BaseResponse<EmployeeResponse> getEmployee(@RequestParam Long id) {
        return new BaseResponse<>(conversionService.convert(
                employeeService.getEmployeeByIdOrThrowException(id), EmployeeResponse.class));
    }

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_SALES})
    @GetMapping("/get_report_employees")
    @ApiOperation(value = "Получение уникальных значений для фильтра по сотрудникамв отчёте по лидам",
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
    public BaseResponse<Page<SaleReportEmployeeResponse>> getReportEmployees(
            @QuerydslPredicate(root = SaleReport.class) Predicate predicate,
            Pageable pageable) {
        return new BaseResponse<>(employeeService.getReportEmployees(predicate, pageable));
    }
}
