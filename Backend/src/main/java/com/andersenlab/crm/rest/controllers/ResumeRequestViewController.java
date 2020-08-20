package com.andersenlab.crm.rest.controllers;

import com.andersenlab.crm.aop.HasRole;
import com.andersenlab.crm.configuration.swagger.ApiPageable;
import com.andersenlab.crm.rest.BaseResponse;
import com.andersenlab.crm.rest.dto.ResumeRequestViewDto;
import com.andersenlab.crm.rest.facade.ReportFile;
import com.andersenlab.crm.rest.facade.ResumeRequestViewFacade;
import com.andersenlab.crm.rest.resolvers.AllResumeRequestViewPredicateResolver;
import com.andersenlab.crm.rest.resolvers.CrmPredicate;
import com.querydsl.core.types.Predicate;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

import static com.andersenlab.crm.model.RoleEnum.ROLE_ADMIN;
import static com.andersenlab.crm.model.RoleEnum.ROLE_HR;
import static com.andersenlab.crm.model.RoleEnum.ROLE_MANAGER;
import static com.andersenlab.crm.model.RoleEnum.ROLE_RM;
import static com.andersenlab.crm.model.RoleEnum.ROLE_SALES;
import static com.andersenlab.crm.model.RoleEnum.ROLE_SALES_HEAD;

@RestController
@RequestMapping("/all_resume_request")
@RequiredArgsConstructor
public class ResumeRequestViewController extends BaseController {

    private final ResumeRequestViewFacade resumeRequestViewFacade;
    private final ReportFile reportFile;

    @HasRole(roles = {ROLE_ADMIN, ROLE_SALES_HEAD, ROLE_SALES, ROLE_RM, ROLE_MANAGER, ROLE_HR})
    @GetMapping(value = "/{id}")
    @ApiOperation(value = "Получения запроса на резюме по id",
            notes = "id - обязательное поле(прим. /10)")
    public BaseResponse<ResumeRequestViewDto> getById(@PathVariable Long id) {
        return new BaseResponse<>(resumeRequestViewFacade.get(id));
    }

    @HasRole(roles = {ROLE_ADMIN, ROLE_SALES_HEAD, ROLE_SALES, ROLE_RM, ROLE_MANAGER, ROLE_HR})
    @GetMapping
    @ApiPageable
    @ApiOperation(value = "Получение списка запросов на резюме с возможностью фильтрации",
            notes = "Обязательных полей нет.\n" +
                    "Возможные фильтры по полям:\n isActive - активность (прим. isActive=false)\n companyId - id компании (прим. companyId=42180)\n" +
                    "responsibleId - id ответственного сотрудника (прим. responsibleId=71369)\n responsibleForSaleRequestId - id сотрудника ответсвенного за запрос на продажу (прим. responsibleForSaleRequestId=34)\n" +
                    "name - название резюме (прим. name=DevOps)\n status - статус запроса на резюме (Возможен множественный выбор прим. status=Pending&status=HR Need)\n " +
                    "resumes.status - статус резюме (Возможен множественный выбор прим. resumes.status=Pending&resumes.status=HR Need)\n responsibleHrs - id hr ответственного за резюме (Возможен множественный выбор прим. resumes.responsibleHr.id=92&resumes.responsibleHr.id=163)\n" +
                    "Задание параметров отображения результата:\n page - номер страницы результатов (прим. page=9)\n" +
                    "size - количество записей на странице (прим. size=13)\n sort - сортировка (прим. sort=id,desc)")
    public BaseResponse<Page<ResumeRequestViewDto>> get(
            @CrmPredicate(resolver = AllResumeRequestViewPredicateResolver.class) Predicate predicate,
            Pageable pageable) {

        return new BaseResponse<>(resumeRequestViewFacade.get(predicate, pageable));
    }

    @HasRole(roles = {ROLE_SALES_HEAD})
    @PostMapping("/reports/download")
    @ApiPageable
    @ApiOperation(value = "Выгрузка запросов на резюме в CSV c возможностью фильтрации",
            notes = "Обязательных полей нет.\n" +
                    "Возможные фильтры по полям:\n isActive - активность (прим. isActive=false)\n companyId - id компании (прим. companyId=42180)\n" +
                    "responsibleId - id ответственного сотрудника (прим. responsibleId=71369)\n responsibleForSaleRequestId - id сотрудника ответсвенного за запрос на продажу (прим. responsibleForSaleRequestId=34)\n" +
                    "name - название резюме (прим. name=DevOps)\n status - статус запроса на резюме (Возможен множественный выбор прим. status=Pending&status=HR Need)\n " +
                    "resumes.status - статус резюме (Возможен множественный выбор прим. resumes.status=Pending&resumes.status=HR Need)\n responsibleHrs - id hr ответственного за резюме (Возможен множественный выбор прим. resumes.responsibleHr.id=92&resumes.responsibleHr.id=163)\n" +
                    "Задание параметров отображения результата:\n page - номер страницы результатов (прим. page=9)\n" +
                    "size - количество записей на странице (прим. size=13)\n sort - сортировка (прим. sort=id,desc)")
    public HttpEntity<byte[]> downloadReports(
            @CrmPredicate(resolver = AllResumeRequestViewPredicateResolver.class) Predicate predicate,
            Pageable pageable) {

        byte[] document = reportFile.getResumeRequestReport(predicate, pageable);
        return new HttpEntity<>(document, defineHttpHeadersDownload("resume_requests_report.csv"));
    }

    @HasRole(roles = {ROLE_SALES_HEAD})
    @GetMapping(value = "/reports/resume_processing")
    @ApiOperation(value = "Выгрузка отчёта о времени обработки резюме в CSV",
            notes = "from - обязательное поле (в формате - \"yyyy-MM-dd\").\n" +
                    "to - необязательное поле (в формате - \"yyyy-MM-dd\").\n" +
                    "Если параметр to не указан, текущая дата выбирается крайней для отчета.\n" +
                    "(прим. from=2020-01-01&to=2020-02-14)")
    public HttpEntity<byte[]> downloadResumeProcessingReport(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate to
    ) {
        byte[] document = reportFile.getResumeProcessingReport(from, to);
        return new HttpEntity<>(document, defineHttpHeadersDownload("processing_report.csv"));
    }
}
