package com.andersenlab.crm.rest.controllers;

import com.andersenlab.crm.aop.HasRole;
import com.andersenlab.crm.configuration.swagger.ApiPageable;
import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.model.view.ResumeView;
import com.andersenlab.crm.rest.BaseResponse;
import com.andersenlab.crm.rest.facade.ReportFile;
import com.andersenlab.crm.rest.response.ResumeViewResponse;
import com.andersenlab.crm.services.ResumeViewService;
import com.querydsl.core.types.Predicate;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.querydsl.binding.QuerydslPredicate;
import org.springframework.http.HttpEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.andersenlab.crm.model.RoleEnum.ROLE_HR;


@RestController
@RequestMapping("/all_resume")
@RequiredArgsConstructor
public class ResumeViewController extends BaseController {
    private final ConversionService conversionService;
    private final ResumeViewService resumeViewService;
    private final ReportFile reportFile;

    @HasRole(roles = {ROLE_HR})
    @GetMapping
    @ApiOperation(value = "Получить список резюме с возможностью фильтрации",
            notes = "Обязательных полей нет.\n" +
                    "Возможные фильтры по полям:\n id - id резюме(Возможен множественный выбор прим. id=11012&id=11014)\n" +
                    "comment - комментарий hr(Возможен множественный выбор прим. comment=скинула ему на апрув&comment=в реальных)\n " +
                    "createDate - дата создания резюме(прим. createDate=2017-12-28T11:31:55)\n deadline - дата дедлайна(прим. deadline=2016-04-04T21:00:00)\n" +
                    "fio - ФИО кандидата (Возможен множественный выбор прим. fio=CV Viktor Boiko FE (1).doc&fio=CV Svinchyak.docx)\n isUrgent - срочность(прим. isUrgent=true)\n" +
                    "responsibleHr - id ответсвенных hr (Возможен множественный выбор прим. responsibleHr=228&responsibleHr=46)\n resumeRequest - id запроса на резюме (Возможен множественный выбор прим. resumeRequest=2536&resumeRequest=2641)\n" +
                    "status - статус резюме(Возможен множественный выбор прим. status=Pending&status=HR Need)\n" +
                    "Задание параметров отображения результата:\n page - номер страницы результатов (прим. page=9)\n" +
                    "size - количество записей на странице (прим. size=13)\n sort - сортировка (прим. sort=id,desc)")
    public BaseResponse getResumes(
            @QuerydslPredicate(root = ResumeView.class) Predicate predicate,
            Pageable pageable) {
        return new BaseResponse<>(conversionService.convertToPage(pageable, resumeViewService.get(predicate, pageable), ResumeViewResponse.class));
    }

    @HasRole(roles = {ROLE_HR})
    @GetMapping("/{id}")
    @ApiOperation(value = "Получение резюме по id.",
            notes = "id - обязательное поле (прим. /29)")
    public BaseResponse getResume(@PathVariable Long id) {
        return new BaseResponse<>(conversionService.convert(resumeViewService.get(id), ResumeViewResponse.class));
    }

    @HasRole(roles = {ROLE_HR})
    @PostMapping("/reports/download")
    @ApiPageable
    @ApiOperation(value = "Выгрузка запросов на резюме в CSV с возможностью фильтрации",
            notes = "Обязательных полей нет.\n" +
                    "Возможные фильтры по полям:\n id - id резюме(Возможен множественный выбор прим. id=11012&id=11014)\n" +
                    "comment - комментарий hr(Возможен множественный выбор прим. comment=скинула ему на апрув&comment=в реальных)\n " +
                    "createDate - дата создания резюме(прим. createDate=2017-12-28T11:31:55)\n deadline - дата дедлайна(прим. deadline=2016-04-04T21:00:00)\n" +
                    "fio - ФИО кандидата (Возможен множественный выбор прим. fio=CV Viktor Boiko FE (1).doc&fio=CV Svinchyak.docx)\n isUrgent - срочность(прим. isUrgent=true)\n" +
                    "responsibleHr - id ответсвенных hr (Возможен множественный выбор прим. responsibleHr=228&responsibleHr=46)\n resumeRequest - id запроса на резюме (Возможен множественный выбор прим. resumeRequest=2536&resumeRequest=2641)\n" +
                    "status - статус резюме(Возможен множественный выбор прим. status=Pending&status=HR Need)\n" +
                    "Задание параметров отображения результата:\n page - номер страницы результатов (прим. page=9)\n" +
                    "size - количество записей на странице (прим. size=13)\n sort - сортировка (прим. sort=id,desc)")
    public HttpEntity<byte[]> downloadReports(@QuerydslPredicate(root = ResumeView.class) Predicate predicate) {
        byte[] document = reportFile.getResumeReport(predicate);
        return new HttpEntity<>(document, defineHttpHeadersDownload("report.csv"));
    }
}
