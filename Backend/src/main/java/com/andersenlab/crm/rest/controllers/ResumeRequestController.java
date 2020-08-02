package com.andersenlab.crm.rest.controllers;

import com.andersenlab.crm.aop.HasRole;
import com.andersenlab.crm.configuration.swagger.ApiPageable;
import com.andersenlab.crm.model.entities.Resume;
import com.andersenlab.crm.model.entities.ResumeRequest;
import com.andersenlab.crm.rest.BaseResponse;
import com.andersenlab.crm.rest.dto.CommentDto;
import com.andersenlab.crm.rest.dto.file.FileDto;
import com.andersenlab.crm.rest.dto.history.HistoryDto;
import com.andersenlab.crm.rest.dto.resumerequest.ResumeRequestDtoUpdate;
import com.andersenlab.crm.rest.facade.ResumeFacade;
import com.andersenlab.crm.rest.facade.ResumeRequestFacade;
import com.andersenlab.crm.rest.request.CommentCreateRequest;
import com.andersenlab.crm.rest.request.ResumeDto;
import com.andersenlab.crm.rest.request.ResumeRequestCreateRequest;
import com.andersenlab.crm.rest.response.ResumeRequestDto;
import com.andersenlab.crm.services.ResumeRequestService;
import com.andersenlab.crm.validation.PermittedAttachment;
import com.querydsl.core.types.Predicate;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.querydsl.binding.QuerydslPredicate;
import org.springframework.http.MediaType;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import springfox.documentation.annotations.ApiIgnore;

import javax.validation.Valid;
import java.util.List;
import java.util.Locale;

import static com.andersenlab.crm.model.RoleEnum.ROLE_HR;
import static com.andersenlab.crm.model.RoleEnum.ROLE_MANAGER;
import static com.andersenlab.crm.model.RoleEnum.ROLE_RM;
import static com.andersenlab.crm.model.RoleEnum.ROLE_SALES;
import static com.andersenlab.crm.model.RoleEnum.ROLE_SALES_HEAD;
import static com.andersenlab.crm.model.RoleEnum.ROLE_SITE;

@Validated
@RequiredArgsConstructor
@RestController
@RequestMapping("/resume_request")
public class ResumeRequestController extends BaseController {

    private final ResumeRequestService resumeRequestService;
    private final ResumeRequestFacade resumeRequestFacade;
    private final ResumeFacade resumeFacade;

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_MANAGER, ROLE_RM, ROLE_SALES})
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "Создание запроса на резюме.",
            notes = "Входящих фильтрующих полей нет.")
    public BaseResponse<ResumeRequestDto> createRequest(
            @ApiParam @RequestPart("files") MultipartFile[] files,
            @ApiIgnore @RequestPart("json") @Valid ResumeRequestCreateRequest json) {
        return new BaseResponse<>(resumeRequestFacade.create(json, files));
    }

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_HR, ROLE_MANAGER, ROLE_RM, ROLE_SALES, ROLE_SITE})
    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "Получение запроса на резюме по id.",
            notes = "id - обязательное поле(прим. /10)")
    public BaseResponse<ResumeRequestDto> getById(@PathVariable("id") Long id) {
        return new BaseResponse<>(resumeRequestFacade.getByID(id));
    }

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_HR, ROLE_MANAGER, ROLE_RM, ROLE_SALES})
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiPageable
    @ApiOperation(value = "Получение списка запроса на резюме c возможностью фильтрации",
            notes = "Обязательных полей нет.\n" +
                    "Возможные фильтры по полям:\n id - id запроса(прим. id=10)\n author - id автора запроса (прим. author =4)\n comments - id комментариев(прим. comments=169)\n" +
                    "company - id компании (прим. company=31460)\n companySale - id продажи компании (прим. companySale=55308)\n createDate - дата создания(Возможен множественный выбор прим. createDate=2016-04-08T01:31:49&createDate=2017-06-05T21:00:42)\n" +
                    "deadline - дата дедлайна (deadline=2019-01-08T00:00:00) \n doneDate - дата выполнения (Возможен множественный выбор прим. doneDate=2019-03-14T16:28:45&doneDate=2018-05-12T16:28:45)\n files - id файла (прим. files=4) isActive - флаг активности (прим. isActive=false)\n" +
                    "name - имя запроса (Возможен множественный выбор  прим. name=PHP&name=iOS, Java)\n oldId - старый id (Возможен множественный выбор прим. oldId=3339&oldId=759)\n" +
                    "priority - приоритет запроса (Возможен множественный выбор прим. priority=Major&priority=Critical)\n requestResumeHistories - id истории запроса на резюме(прим. requestResumeHistories=243)\n" +
                    "responsibleForRequest - id ответственного за запрос(Возможен множественный выбор прим. responsibleForRequest=92&responsibleForRequest=163)\n responsibleForSaleRequest - id ответсвенного за продажу (Возможен множественный выбор  прим. responsibleForSaleRequest=87&responsibleForSaleRequest=40)\n" +
                    "responsibleRM - id ответсвенного ресурс менедж.(Возможен множественный  прим. responsibleRM=4&responsibleRM=49)\n resumes - id резюме (прим. resumes=40)\n startAt - дата старта (прим. startAt=2017-06-15T16:10:46)\n status - статус запроса (прим. status=Name need&status=HR Need)\n" +
                    "statusChangedDate - дата изменения статуса (прим. statusChangedDate=2019-07-18T09:11:09)\n" +
                    "Задание параметров отображения результата:\n page - номер страницы результатов (прим. page=9)\n" +
                    "size - количество записей на странице (прим. size=13)\n sort - сортировка (прим. sort=id,desc)")
    public BaseResponse<Page<ResumeRequestDto>> get(
            @QuerydslPredicate(root = ResumeRequest.class) Predicate predicate,
            Pageable pageable
    ) {
        return new BaseResponse<>(resumeRequestFacade.get(predicate, pageable));
    }

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_HR, ROLE_MANAGER, ROLE_RM, ROLE_SALES})
    @PutMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "Изменение запроса на резюме и перезапись его в БД",
            notes = "id - обязательное поле (прим. /10)")
    public BaseResponse<ResumeRequestDto> put(@PathVariable("id") Long id, @RequestBody ResumeRequestDtoUpdate dto) {
        return new BaseResponse<>(resumeRequestFacade.update(id, dto));
    }

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_HR, ROLE_MANAGER, ROLE_RM, ROLE_SALES})
    @DeleteMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "Удаление запроса на резюме.",
            notes = "id - обязательное поле (прим. /10)")
    public BaseResponse deleteAnswers(@PathVariable("id") Long id) {
        resumeRequestFacade.delete(id);
        return new BaseResponse<>();
    }

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_HR, ROLE_MANAGER, ROLE_RM, ROLE_SALES})
    @GetMapping("/get_priorities")
    @ApiOperation(value = "Получение списка приоритетов.",
            notes = "Входящих полей нет")
    public BaseResponse<List<String>> getPriorities() {
        return new BaseResponse<>(resumeRequestService.getPriorities());
    }

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_HR, ROLE_MANAGER, ROLE_RM, ROLE_SALES})
    @GetMapping("/get_statuses")
    @ApiOperation(value = "Получение списка статусов.",
            notes = "Входящих полей нет")
    public BaseResponse<List<String>> getStatuses() {
        return new BaseResponse<>(resumeRequestService.getStatuses());
    }

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_HR, ROLE_MANAGER, ROLE_RM, ROLE_SALES})
    @ApiOperation(value = "Cоздаёт и сохраняет в БД резюме",
            notes = "id - обязательное поле (прим. /10/resume)")
    @PostMapping("/{id}/resume")
    public BaseResponse createResume(@PathVariable Long id, @RequestPart("resumeDto") ResumeDto resumeDto, @RequestPart("files") MultipartFile[] files) {
        return new BaseResponse<>(resumeFacade.create(id, resumeDto, files));
    }

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_HR, ROLE_MANAGER, ROLE_RM, ROLE_SALES})
    @ApiOperation(value = "Изменение запроса на резюме и перезапись его в БД",
            notes = "id - обязательное поле (прим. /resume/10)")
    @PutMapping("/resume/{id}")
    public BaseResponse updateResume(@PathVariable Long id, @RequestBody ResumeDto resumeDto) {
        return new BaseResponse<>(resumeFacade.update(id, resumeDto));
    }

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_HR, ROLE_MANAGER, ROLE_RM, ROLE_SALES})
    @ApiOperation(value = "Удаление резюме",
            notes = "id - обязательное поле (прим. /resume/10)")
    @DeleteMapping("/resume/{id}")
    public BaseResponse updateResume(@PathVariable Long id) {
        resumeFacade.delete(id);
        return new BaseResponse<>();
    }

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_HR, ROLE_MANAGER, ROLE_RM, ROLE_SALES})
    @GetMapping("/resume")
    @ApiOperation(value = "Получение списка резюме, c возможностью фильтрации",
            notes = "Обязательных полей нет.\n" +
                    "Возможные фильтры по полям:\n id - число входящее в id резюме (Возможен множественный выбор прим. id=29&id=40)\n " +
                    "author - id автора (Возможен множественный выбор прим. author=70177&author=70179)\n createDate - дата создания (Возможен множественный выбор прим. createDate=2018-12-04T09:36:20&createDate=2016-02-22T06:35:52)\n" +
                    "files - id файла (прим. files=2370)\n fio - ФИО кандидата (Возможен множественный выбор прим. fio=CV_Andersen_Sulatskov.pdf&fio=CV_sen_Rakov_Sobol.pdf)\n" +
                    "histories - id истории резюме (прим. histories=63431)\n hrComment - комментарий hr(Возможен множественный выбор прим. hrComment=постучалась&hrComment=отправила на апрув, но сегодня он занят)\n" +
                    "isActive - активность (прим. isActive=true)\n isUrgent - срочность(прим. isUrgent=true)\n responsibleHr - id ответственного hr (Возможен множественный выбор прим. histories=63531&responsibleHr=70179)\n" +
                    "resumeRequest - id запроса на резюме (Возможен множественный выбор прим. resumeRequest=3412&resumeRequest=3452)\n returnsResumeCount - счётчик резюме (Возможен множественный выбор прим. returnsResumeCount=5&returnsResumeCount=4)\n" +
                    "status - статус резюме (Возможен множественный выбор прим. status=Pending&status=In progress)\n statusChangedDate - дата изменения статуса (прим. statusChangedDate=2019-04-05T09:13:47)\n" +
                    "Задание параметров отображения результата:\n page - номер страницы результатов (прим. page=9)\n" +
                    "size - количество записей на странице (прим. size=13)\n sort - сортировка (прим. sort=id,desc)")
    public BaseResponse getResumes(@QuerydslPredicate(root = Resume.class) Predicate predicate,
                                   Pageable pageable) {
        return new BaseResponse<>(resumeFacade.get(predicate, pageable));
    }

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_HR, ROLE_MANAGER, ROLE_RM, ROLE_SALES})
    @ApiOperation(value = "Прикрепление файла к резюме",
            notes = "id - обязательное поле (прим. /resume/10/attachment)")
    @PostMapping("/resume/{id}/attachment")
    public BaseResponse attachFileToResume(@PathVariable Long id,
                                           @RequestPart("file") @PermittedAttachment MultipartFile file) {
        return new BaseResponse<>(resumeFacade.attachFile(id, file));
    }

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_HR, ROLE_MANAGER, ROLE_RM, ROLE_SALES})
    @ApiOperation(value = "Открепление файла от резюме",
            notes = "id и fileId - обязательные поля (прим. /resume/10999/attachment/15604)")
    @DeleteMapping("/resume/{id}/attachment/{fileId}")
    public BaseResponse detachFileFromResume(@PathVariable Long id, @PathVariable Long fileId) {
        resumeFacade.detachFile(id, fileId);
        return new BaseResponse<>();
    }

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_MANAGER, ROLE_RM, ROLE_SALES, ROLE_HR})
    @PostMapping(value = "/{id}/attachment")
    @ApiOperation(value = "Прикрепление вложения к запросу на резюме по id.",
            notes = "id - обязательное поле (прим. /10/attachment)")
    public BaseResponse<List<FileDto>> attachFile(@PathVariable("id") Long id, @RequestPart("file") List<MultipartFile> files) {

        return new BaseResponse<>(resumeRequestFacade.attachMultipleFiles(id, files));
    }

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_MANAGER, ROLE_RM, ROLE_SALES, ROLE_HR})
    @GetMapping(value = "/{id}/attachment")
    @ApiOperation(value = "Получение всех вложений к запросу на резюме по id.",
            notes = "id - обязательное поле (прим. /10/attachment)\n" +
                    "Задание параметров отображения результата:\n page - номер страницы результатов (прим. page=9)\n" +
                    "size - количество записей на странице (прим. size=13)\n sort - сортировка (прим. sort=id,desc)")
    @ApiPageable
    public BaseResponse<Page<FileDto>> getFiles(@PathVariable("id") Long id, Pageable pageable) {
        return new BaseResponse<>(resumeRequestFacade.getFiles(pageable, id));
    }

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_MANAGER, ROLE_RM, ROLE_SALES, ROLE_HR})
    @DeleteMapping(value = "/{id}/attachment/{fileId}")
    @ApiOperation(value = "Удаление вложения к запросу на резюме по id.",
    notes = "id и fileId - обязательные поля (прим. /10999/attachment/15604)\n")
    public BaseResponse deleteFile(@PathVariable("id") Long id, @PathVariable("fileId") Long fileId) {
        resumeRequestFacade.deleteFile(id, fileId);
        return new BaseResponse<>();
    }

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_MANAGER, ROLE_RM, ROLE_SALES, ROLE_HR})
    @PostMapping(value = "/{id}/comment", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "Добавление комментария к запросу на резюме по id.",
    notes="id - обязательное поле (прим. /10/comment)")
    public BaseResponse<CommentDto> comment(@PathVariable("id") Long id, @RequestBody @Valid CommentCreateRequest dto) {
        return new BaseResponse<>(resumeRequestFacade.createComment(id, dto));
    }

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_MANAGER, ROLE_RM, ROLE_SALES, ROLE_HR})
    @PutMapping(value = "/{id}/comment/{commentId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "Редактирование комментария к запросу на резюме по id.",
    notes = "id и commentId - обязательные поля (прим. /10/comment/46)")
    public BaseResponse<CommentDto> updateComment(
            @PathVariable("id") Long id,
            @PathVariable("commentId") Long commentId,
            @RequestBody @Valid CommentCreateRequest dto) {
        return new BaseResponse<>(resumeRequestFacade.updateComment(id, commentId, dto));
    }

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_MANAGER, ROLE_RM, ROLE_SALES, ROLE_HR})
    @GetMapping(value = "/{id}/comment", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "Получение комментариев к запросу на резюме по id.",
    notes = "id - обязательное поле (прим. /10/comment)")
    @ApiPageable
    public BaseResponse<Page<CommentDto>> getComments(@PathVariable("id") Long id, Pageable pageable) {
        return new BaseResponse<>(resumeRequestFacade.getComments(pageable, id));
    }

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_MANAGER, ROLE_RM, ROLE_SALES, ROLE_HR})
    @DeleteMapping(value = "/{id}/comment/{commentId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "Удаление комментария к запросу на резюме по id.",
            notes = "id и commentId - обязательные поля (прим. /10/comment/46)")
    public BaseResponse deleteComment(
            @PathVariable("id") Long id,
            @PathVariable("commentId") Long commentId) {
        resumeRequestFacade.deleteComment(id, commentId);
        return new BaseResponse();
    }

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_MANAGER, ROLE_RM, ROLE_SALES, ROLE_HR})
    @GetMapping(value = "/{id}/history", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "Получение истории запроса на резюме по id.",
    notes = "id - обязательное поле (прим. /10/history)")
    @ApiPageable
    public BaseResponse<Page<HistoryDto>> getHistories(
            @PathVariable("id") Long id, Pageable pageable, Locale locale) {
        return new BaseResponse<>(resumeRequestFacade.getHistory(id, pageable, locale));
    }
}
