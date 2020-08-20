package com.andersenlab.crm.rest.controllers;

import com.andersenlab.crm.aop.HasRole;
import com.andersenlab.crm.configuration.swagger.ApiPageable;
import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.model.entities.Contact;
import com.andersenlab.crm.rest.BaseResponse;
import com.andersenlab.crm.rest.facade.ContactFacade;
import com.andersenlab.crm.rest.facade.ReportFile;
import com.andersenlab.crm.rest.facade.SourceFacade;
import com.andersenlab.crm.rest.request.ContactCreateRequest;
import com.andersenlab.crm.rest.request.ContactUpdateRequest;
import com.andersenlab.crm.rest.request.SourceCreateRequest;
import com.andersenlab.crm.rest.request.SourceUpdateRequest;
import com.andersenlab.crm.rest.resolvers.CrmPredicate;
import com.andersenlab.crm.rest.resolvers.SourcePredicateResolver;
import com.andersenlab.crm.rest.response.ContactResponse;
import com.andersenlab.crm.rest.response.SourceResponse;
import com.andersenlab.crm.services.ContactService;
import com.andersenlab.crm.services.SourceService;
import com.querydsl.core.types.Predicate;
import io.swagger.annotations.ApiOperation;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.querydsl.binding.QuerydslPredicate;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpEntity;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
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
import java.util.Locale;

import static com.andersenlab.crm.model.RoleEnum.ROLE_ADMIN;
import static com.andersenlab.crm.model.RoleEnum.ROLE_HR;
import static com.andersenlab.crm.model.RoleEnum.ROLE_MANAGER;
import static com.andersenlab.crm.model.RoleEnum.ROLE_NETWORK_COORDINATOR;
import static com.andersenlab.crm.model.RoleEnum.ROLE_RM;
import static com.andersenlab.crm.model.RoleEnum.ROLE_SALES;
import static com.andersenlab.crm.model.RoleEnum.ROLE_SALES_HEAD;

@RestController
@AllArgsConstructor
@RequestMapping("/contact")
public class ContactController extends BaseController {

    private final ContactService contactService;
    private final ContactFacade contactFacade;
    private SourceService sourceService;
    private final SourceFacade sourceFacade;
    private final ReportFile reportFile;
    private final ConversionService conversionService;

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_MANAGER, ROLE_RM, ROLE_SALES})
    @PostMapping("/create_contact")
    @ApiOperation(value = "Cоздаёт и сохраняет в БД контакт и возращает его id.",
            notes = "Входящих фильтрующих полей нет.")
    public BaseResponse<Long> createContact(@RequestBody @Valid ContactCreateRequest request) {
        return new BaseResponse<>(contactService.createContact(request));
    }

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_SALES, ROLE_HR, ROLE_RM, ROLE_MANAGER})
    @GetMapping("/get_contact")
    @ApiOperation(value = "Получение контакта по id",
            notes = "id - обязательное поле(прим. id=1)")
    public BaseResponse<ContactResponse> getContactById(@RequestParam Long id, Locale locale) {
        return new BaseResponse<>(conversionService.convertWithLocale(contactService.getContactById(id), ContactResponse.class, locale));
    }

    @HasRole(roles = {ROLE_ADMIN, ROLE_SALES_HEAD, ROLE_HR, ROLE_MANAGER, ROLE_RM, ROLE_SALES})
    @GetMapping("/get_contacts")
    @ApiPageable
    @ApiOperation(value = "Получение списка контактов с возможностью фильтрации",
            notes = "Обязательных полей нет.\n" +
                    "Возможные фильтры по полям:\n additionalInfo - дополнительная информация (прим. additionalInfo=http://www.viadeo.com/p/0021th6kmyjgacpu)\n" +
                    "phone - основной номер телефона (прим. phone=0683102694)\n firstName - имя (прим. firstName=Tobias Rohrle) \n" +
                    "id - id контакта (прим. id=573)\n isActive - флаг активности (прим. isActive=true)\n lastName - фамилия (прим. lastName=Foulquier)\n" +
                    "additionalPhone - дополнительный номер телефона (прим. additionalPhone=7 (916) 629-32-86)\n skype - скайп (прим. skype=polarbear_rus)\n" +
                    "activities - перечисление типов активностей (прим. Письмо,Звонок)\n company - id компаний (прим. company=37126)\n country - id страны (прим. country=752)\n" +
                    "createDate - дата создания контакта (прим. createDate=2017-06-06T11:37:27)\n email - емейл (прим. email=cr@columbia.com)\n oldId - старое id (прим. oldId=2661)\n" +
                    "personalEmail - личный емейл (прим. personalEmail=lich@mail.ru)\n position - занимаемая должность (прим. position=Руководитель)\n" +
                    "sales - id продажи (прим. sales=28942)\n sex - пол (прим. sex=Мужской)\n socialNetwork - социальная сеть (прим. socialNetwork=https://www.linkedin.com/pub/dr-pierre-de-muelenaere/)\n" +
                    "socialNetworkUser - id пользователя социальной сети (прим. socialNetworkUser=134)\n source - id источникa (прим. source=3)\n " +
                    "emails - емейл без указания личный это или обычный(фильтр будет вести поиск искать в обоих столбцах прим. emails=lich@mail.ru)\n" +
                    "fio - имя или фамилия(фильтр будет вести поиск в обоих столбцах прим. fio=Policella)\n" +
                    "dateOfBirth - поиск по месяцу и дню рождения (год может быть любым, главное что бы была валидная дата\n" +
                    "(прим. dateOfBirth=2020-06-01 или промежуток dateOfBirth=2020-06-01&dateOfBirth=2020-06-30\n" +
                    "Задание параметров отображения результата:\n page - номер страницы результатов (прим. page=9)\n" +
                    "size - количество записей на странице (прим. size=13)\n sort - сортировка (прим. sort=id,desc)")
    public BaseResponse<Page<ContactResponse>> getContactsWithFilter(@QuerydslPredicate(root = Contact.class) Predicate predicate,
                                                                     Pageable pageable,
                                                                     Locale locale) {
        return new BaseResponse<>(contactFacade.getContactsWithFilterAndLocale(predicate, pageable, locale));
    }

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_SALES})
    @PutMapping("/update_contact")
    @ApiOperation(value = "Изменение контакта и перезапись его в БД",
            notes = "id - обязательное поле (прим. id=573).")
    public BaseResponse updateContact(@RequestParam Long id,
                                      @RequestBody ContactUpdateRequest request) {
        contactService.updateContact(id, request);
        return new BaseResponse<>();
    }

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_SALES})
    @DeleteMapping(path = "/delete_contact")
    @ApiOperation(value = "Удаление активности по id",
            notes = "id - обязательное поле (прим. id=267).")
    public BaseResponse deleteContact(@RequestParam Long id) {
        contactService.deleteContact(id);
        return new BaseResponse();
    }

    @HasRole(roles = {ROLE_ADMIN, ROLE_SALES_HEAD, ROLE_HR, ROLE_MANAGER, ROLE_RM, ROLE_SALES, ROLE_NETWORK_COORDINATOR})
    @GetMapping("/get_source")
    @ApiOperation(value = "Получение списка источников с возможностью фильтрации",
            notes = "Обязательных полей нет\n" +
                    "Возможные фильтры по полям:\n id - id источника (прим. id=1)\n name - имя источника (прим. name=Почта)\n" +
                    "type - тип источника (прим. type=Социальная сеть)\n" +
                    "socialAnswer.status - статусы ответов(Возможен множественный выбор прим. socialAnswer.status=Принято&role=4&socialAnswer.status=Отклонено)\n" +
                    "socialAnswer.createDate - дата создания ответа(Возможен множественный выбор прим. createDate=2019-05-03 07:49:07&createDate=2019-03-22T07:03:51)\n" +
                    "socialAnswer.assistant - id ассисента (прим. socialAnswer.assistant=70002)\n" +
                    "socialAnswer.responsible - id ответственного сотрудника (прим. socialAnswer.responsible=70176)\n" +
                    "socialAnswer.source - id источника(Возможен множественный выбор прим. socialAnswer.source=13&socialAnswer.source=5)" +
                    "socialAnswer.socialContact - id социального контакта (прим. socialAnswer.socialContact=149)\n" +
                    "socialAnswer.country - id странны (прим. socialAnswer.country=36)\n" +
                    "socialAnswer.search - поиск по данной строке (прим. socialAnswer.search=IP Partners)\n" +
                    "saleReport.isSaleReportFilter - флаг необходимый для использования фильтров saleReport(должен иметь значение saleReport.isSaleReportFilter=true)\n" +
                    "saleReport.companyName - название компании (Возможен множественный выбор прим. saleReport.companyName=Апполинариум&saleReport.companyName=SITECH УРАЛ)\n" +
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
                    "Задание параметров отображения результата:\n page - номер страницы результатов (прим. page=2)\n" +
                    "size - количество записей на странице (прим. size=3)\n sort - сортировка (прим. sort=id,desc)")
    public BaseResponse<List<SourceResponse>> getSources(
            @CrmPredicate(resolver = SourcePredicateResolver.class) Predicate predicate,
            Pageable pageable,
            Locale locale
    ) {
        return new BaseResponse<>(conversionService.convertToListWithLocale(
                sourceService.getSourcesWithFilter(predicate, pageable), SourceResponse.class, locale));
    }

    @HasRole(roles = {ROLE_ADMIN, ROLE_SALES_HEAD, ROLE_HR, ROLE_MANAGER, ROLE_RM, ROLE_SALES})
    @PutMapping(path = "/update_source")
    @ApiOperation(value = "Изменение источника и перезапись его в БД",
            notes = "id - обязательное поле (прим. id=2)."
    )
    public BaseResponse updateSource(@RequestParam Long id,
                                     @RequestBody @Valid SourceUpdateRequest request) {
        sourceService.updateSource(id, request);
        return new BaseResponse<>();
    }

    @HasRole(roles = {ROLE_ADMIN, ROLE_SALES_HEAD, ROLE_HR, ROLE_MANAGER, ROLE_RM, ROLE_SALES})
    @PostMapping(path = "/create_source")
    @ApiOperation(value = "Cоздаёт и сохраняет в БД источник и возращает её id.",
            notes = "Входящих фильтрующих полей нет.")
    public BaseResponse createSource(@RequestBody @Valid SourceCreateRequest request) {
        return new BaseResponse<>(sourceFacade.create(request));
    }

    @HasRole(roles = {ROLE_SALES_HEAD})
    @PostMapping(value = "/download", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @ApiOperation(value = "Выгрузка контактов CSV.",
            notes = "Поле(обязательное) \"createDateFrom\" фильтр по дате, использовать в формате \"yyyy-MM-dd\"\n" +
                    "Поле(обязательное) \"createDateTo\" фильтр по дате, использовать в формате \"yyyy-MM-dd\"\n" +
                    "(прим. createDateFrom=2014-03-21&createDateTo=2014-05-21)")
    public HttpEntity<byte[]> downloadReport(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate createDateFrom,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate createDateTo
    ) {
        byte[] document = reportFile.getContactReport(createDateFrom, createDateTo);
        return new HttpEntity<>(document, defineHttpHeadersDownload("contacts_report.csv"));
    }
}
