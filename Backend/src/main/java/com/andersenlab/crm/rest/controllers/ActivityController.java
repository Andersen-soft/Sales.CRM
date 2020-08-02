package com.andersenlab.crm.rest.controllers;

import com.andersenlab.crm.aop.HasRole;
import com.andersenlab.crm.configuration.swagger.ApiPageable;
import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.model.entities.Activity;
import com.andersenlab.crm.model.entities.ActivityReport;
import com.andersenlab.crm.rest.BaseResponse;
import com.andersenlab.crm.rest.facade.ReportFile;
import com.andersenlab.crm.rest.request.ActivityCreateRequest;
import com.andersenlab.crm.rest.request.ActivityUpdateRequest;
import com.andersenlab.crm.rest.response.ActivityResponse;
import com.andersenlab.crm.rest.response.ActivityTypeResponse;
import com.andersenlab.crm.services.ActivityService;
import com.querydsl.core.types.Predicate;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
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
import java.util.Collection;
import java.util.List;
import java.util.Locale;

import static com.andersenlab.crm.model.RoleEnum.ROLE_ADMIN;
import static com.andersenlab.crm.model.RoleEnum.ROLE_HR;
import static com.andersenlab.crm.model.RoleEnum.ROLE_MANAGER;
import static com.andersenlab.crm.model.RoleEnum.ROLE_RM;
import static com.andersenlab.crm.model.RoleEnum.ROLE_SALES;
import static com.andersenlab.crm.model.RoleEnum.ROLE_SALES_HEAD;

@RestController
@RequestMapping("/activity")
@RequiredArgsConstructor
public class ActivityController extends BaseController {

    private final ActivityService activityService;
    private final ReportFile reportFile;
    private final ConversionService conversionService;

    @HasRole(roles = {ROLE_ADMIN, ROLE_SALES_HEAD, ROLE_SALES, ROLE_MANAGER, ROLE_RM, ROLE_HR})
    @GetMapping(path = "/get_activity")
    @ApiOperation(value = "Получение активности по id",
            notes = "id - обязательное поле(прим. id=1)")
    public BaseResponse<ActivityResponse> getResponseById(@RequestParam Long id, Locale locale) {
        return new BaseResponse<>(conversionService.convertWithLocale(activityService.getActivityById(id), ActivityResponse.class, locale));
    }

    @HasRole(roles = {ROLE_ADMIN, ROLE_SALES_HEAD, ROLE_SALES, ROLE_MANAGER, ROLE_RM, ROLE_HR})
    @GetMapping(path = "/get_activities")
    @ApiPageable
    @ApiOperation(value = "Получение списка активностей с возможностью фильтрации",
            notes = "Обязательных полей нет.\n" +
                    "Возможные фильтры по полям:\n id - id активности (прим. i=1)\n isActive - флаг активности(прим. isActive=true )\n" +
                    "activityTypes - перечисление типов (прим. Звонок,Письмо)\n contacts - id контакта (прим. contacts=876)\n" +
                    "dateActivity - дата активности(прим. dateActivity=2018-12-07T16:51:00)\n description - описания (прим. description=Дозвонились)\n" +
                    "search - поиск по данной строке(по всем полям прим. search=письмо)\n types - конкретным типам (прим. types=Звонок)\n" +
                    "companySale - id продажи компании(прим. companySale=50461)\n responsible - id работника (прим. responsible=135)\n" +
                    "Задание параметров отображения результата:\n page - номер страницы результатов (прим. page=9)\n" +
                    "size - количество записей на странице (прим. size=13)\n sort - сортировка (прим. sort=id,desc)")
    public BaseResponse<Page<ActivityResponse>> getActivitiesWithFilter
            (@QuerydslPredicate(root = Activity.class) Predicate predicate,
             Pageable pageable,
             Locale locale) {
        Page<Activity> findAll = activityService.getActivitiesWithFilter(predicate, pageable);
        List<ActivityResponse> response = conversionService.convertToListWithLocale(
                findAll.getContent(), ActivityResponse.class, locale);
        return new BaseResponse<>(new PageImpl<>(response, pageable, findAll.getTotalElements()));
    }

    @HasRole(roles = {ROLE_ADMIN, ROLE_SALES_HEAD, ROLE_SALES, ROLE_MANAGER, ROLE_RM, ROLE_HR})
    @GetMapping(path = "/search")
    @ApiPageable
    @ApiOperation(value = "Получение списка активностей включающих данную строку, с возможностью фильтрации",
            notes = "query - обязательное,строковое поле.\n" +
                    "Возможные фильтры по полям:\n id - id активности (прим. i=1)\n isActive - флаг активности(прим. isActive=true )\n" +
                    "activityTypes - перечисление типов (прим. Звонок,Письмо)\n contacts - id контакта (прим. contacts=876)\n" +
                    "dateActivity - дата активности(прим. dateActivity=2018-12-07T16:51:00)\n description - описания (прим. description=Дозвонились)\n" +
                    "search - поиск по данной строке(по всем полям прим. search=письмо)\n types - конкретным типам (прим. types=Звонок)\n" +
                    "companySale - id продажи компании(прим. companySale=50461)\n responsible - id работника (прим. responsible=135)\n" +
                    "Задание параметров отображения результата:\n page - номер страницы результатов (прим. page=9)\n" +
                    "size - количество записей на странице (прим. size=13)\n sort - сортировка (прим. sort=id,desc)")
    public BaseResponse<Page<ActivityResponse>> getActivitiesWithSearch(
            @RequestParam String query,
            @QuerydslPredicate(root = Activity.class) Predicate predicate,
            Pageable pageable,
            Locale locale
    ) {
        Page<Activity> allActivity = activityService.getActivitiesWithSearch(query, predicate, pageable);
        List<ActivityResponse> response = conversionService.convertToListWithLocale(allActivity.getContent(), ActivityResponse.class, locale);
        return new BaseResponse<>(new PageImpl<>(response, pageable, allActivity.getTotalElements()));
    }

    @HasRole(roles = {ROLE_ADMIN, ROLE_SALES_HEAD, ROLE_SALES, ROLE_MANAGER, ROLE_RM, ROLE_HR})
    @GetMapping(path = "/get_types")
    @ApiOperation(value = "Получение списка возможных типов активностей",
            notes = "Входящих полей нет.")
    public BaseResponse<Collection<ActivityTypeResponse>> getTypes(Locale locale) {
        return new BaseResponse<>(activityService.getTypeNames(locale));
    }

    @HasRole(roles = {ROLE_SALES, ROLE_SALES_HEAD})
    @PutMapping(path = "/update_activity")
    @ApiOperation(value = "Изменение активности и перезапись её в БД",
            notes = "id - обязательное поле (прим. id=223159).")
    public BaseResponse updateActivity(@RequestParam Long id,
                                       @RequestBody @Valid ActivityUpdateRequest request) {

        return new BaseResponse<>(activityService.updateActivity(id, request));
    }

    @HasRole(roles = {ROLE_ADMIN, ROLE_SALES_HEAD, ROLE_SALES})
    @PostMapping(path = "/create_activity")
    @ApiOperation(value = "Cоздаёт и сохраняет в БД активность и возращает её id.",
            notes = "Входящих фильтрующих полей нет.")
    public BaseResponse createActivity(@RequestBody @Valid ActivityCreateRequest request) {
        return new BaseResponse<>(activityService.createActivity(request));
    }

    @HasRole(roles = {ROLE_ADMIN, ROLE_SALES_HEAD, ROLE_SALES})
    @DeleteMapping(path = "/delete_activity")
    @ApiOperation(value = "Удаление активности по id",
            notes = "id - обязательное поле (прим. id=2).")
    public BaseResponse deleteActivity(@RequestParam Long id) {
        activityService.deleteActivity(id);
        return new BaseResponse();
    }

    @HasRole(roles = {ROLE_SALES_HEAD})
    @GetMapping(path = "/reports")
    @ApiOperation(value = "Отображение отчётов",
            notes = "from,to - обязательные поля(в формате - \"yyyy-MM-dd\").\n" +
                    "(прим. from=2018-06-12&to=2019-07-30)")
    public BaseResponse<List<ActivityReport>> getReports(@RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate from,
                                                         @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate to) {
        return new BaseResponse<>(activityService.getReports(from, to));
    }

    @HasRole(roles = {ROLE_SALES_HEAD})
    @PostMapping(value = "/reports/download", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @ApiOperation(value = "Выгрузка отчётов об активностях в CSV",
            notes = "creationFrom и creationTo - обязательные поля(в формате - \"yyyy-MM-dd\").\n" +
                    "(прим. creationFrom=2018-06-12&creationTo=2019-07-30)")
    public HttpEntity<byte[]> downloadReports(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate creationFrom,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate creationTo
    ) {
        byte[] document = reportFile.getActivitiesReport(creationFrom, creationTo);
        return new HttpEntity<>(document, defineHttpHeadersDownload("report.csv"));
    }


}
