package com.andersenlab.crm.rest.controllers;

import com.andersenlab.crm.aop.HasRole;
import com.andersenlab.crm.configuration.swagger.ApiPageable;
import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.model.entities.EstimationRequest;
import com.andersenlab.crm.rest.BaseResponse;
import com.andersenlab.crm.rest.dto.EstimationRequestOldDto;
import com.andersenlab.crm.rest.dto.file.FileDto;
import com.andersenlab.crm.rest.facade.EstimationRequestFacade;
import com.andersenlab.crm.rest.facade.ReportFile;
import com.andersenlab.crm.rest.request.CommentCreateRequest;
import com.andersenlab.crm.rest.request.CommentUpdateRequest;
import com.andersenlab.crm.rest.request.EstimationRequestAttach;
import com.andersenlab.crm.rest.request.EstimationRequestCreate;
import com.andersenlab.crm.rest.request.EstimationRequestUpdate;
import com.andersenlab.crm.rest.resolvers.CrmPredicate;
import com.andersenlab.crm.rest.resolvers.EstimationRequestPredicateResolver;
import com.andersenlab.crm.rest.response.CommentResponse;
import com.andersenlab.crm.rest.response.EstimationRequestResponse;
import com.andersenlab.crm.services.CommentService;
import com.andersenlab.crm.services.EstimationRequestService;
import com.andersenlab.crm.services.WsSender;
import com.querydsl.core.types.Predicate;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.querydsl.binding.QuerydslPredicate;
import org.springframework.http.HttpEntity;
import org.springframework.http.MediaType;
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

import javax.validation.Valid;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static com.andersenlab.crm.model.RoleEnum.ROLE_ADMIN;
import static com.andersenlab.crm.model.RoleEnum.ROLE_HR;
import static com.andersenlab.crm.model.RoleEnum.ROLE_MANAGER;
import static com.andersenlab.crm.model.RoleEnum.ROLE_RM;
import static com.andersenlab.crm.model.RoleEnum.ROLE_SALES;
import static com.andersenlab.crm.model.RoleEnum.ROLE_SALES_HEAD;

/**
 * @author Yevhenii Pshenychnyi
 */
@RequiredArgsConstructor
@RestController
@RequestMapping("/estimation_requests")
public class EstimationRequestController extends BaseController {
    private final EstimationRequestService estimationRequestService;
    private final EstimationRequestFacade estimationRequestFacade;
    private final CommentService commentService;
    private final ReportFile reportFileService;
    private final ConversionService conversionService;
    private final WsSender wsSender;

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_MANAGER, ROLE_RM, ROLE_SALES})
    @ApiOperation(value = "Создание запроса на оценку.")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public BaseResponse createRequest(@ApiParam @RequestPart("files") MultipartFile[] files,
                                      @ApiParam @RequestPart("json") @Valid EstimationRequestCreate json) {
        return new BaseResponse<>(conversionService.convert(
                estimationRequestService.createRequest(json, files), EstimationRequestResponse.class));
    }

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_MANAGER, ROLE_RM, ROLE_SALES})
    @PostMapping(value = "/create_old")
    public BaseResponse createRequestFromOldCrm(@RequestBody @Valid EstimationRequestOldDto json) {
        return estimationRequestFacade.createOldRequest(json);
    }

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_MANAGER, ROLE_RM, ROLE_SALES, ROLE_HR})
    @ApiOperation(value = "Получение запроса на оценку.")
    @GetMapping("/{id}")
    public BaseResponse<EstimationRequestResponse> getRequest(@PathVariable Long id) {
        return new BaseResponse<>(conversionService.convert(
                estimationRequestService.getActiveRequestById(id), EstimationRequestResponse.class));
    }

    @HasRole(roles = {ROLE_ADMIN, ROLE_SALES_HEAD, ROLE_HR, ROLE_MANAGER, ROLE_RM, ROLE_SALES})
    @GetMapping
    @ApiOperation(value = "Получение списка запросов на оценку.")
    @ApiPageable
    public BaseResponse<Page<EstimationRequestResponse>> getRequestsWithFilter(
            @QuerydslPredicate(root = EstimationRequest.class) Predicate predicate,
            Pageable pageable) {
        return new BaseResponse<>(conversionService.convertToPage(
                pageable, estimationRequestService.getRequestsWithFilter(predicate, pageable), EstimationRequestResponse.class));
    }

    @HasRole(roles = ROLE_SALES_HEAD)
    @GetMapping("/reports/download")
    @ApiOperation(value = "Выгрузка запросов на оценку в csv.")
    @ApiPageable
    public HttpEntity<byte[]> downloadCsv(
            @QuerydslPredicate(root = EstimationRequest.class) Predicate predicate,
            Pageable pageable) {
        byte[] document = reportFileService.getEstimationsRequestReport(predicate, pageable);
        return new HttpEntity<>(document, defineHttpHeadersDownload("estimation_requests_report.csv"));
    }

    @HasRole(roles = {ROLE_ADMIN, ROLE_SALES_HEAD, ROLE_HR, ROLE_MANAGER, ROLE_RM, ROLE_SALES})
    @GetMapping("/get_not_tied_to_sales_requests")
    @ApiPageable
    public BaseResponse<List<EstimationRequestResponse>> getNotTiedToSalesRequestsWithFilter(
            @CrmPredicate(resolver = EstimationRequestPredicateResolver.class) Predicate predicate,
            Pageable pageable) {
        return new BaseResponse<>(conversionService.convertToList(
                estimationRequestService.getNotTiedToSalesRequestsWithFilter(predicate, pageable), EstimationRequestResponse.class));
    }

    @HasRole(roles = {ROLE_ADMIN, ROLE_SALES_HEAD, ROLE_HR, ROLE_MANAGER, ROLE_RM, ROLE_SALES})
    @ApiOperation(value = "Получение списка возможных статусов.")
    @GetMapping("/statuses")
    public BaseResponse<List<String>> getStatuses() {
        return new BaseResponse<>(estimationRequestService.getStatuses());
    }

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_MANAGER, ROLE_RM, ROLE_SALES})
    @ApiOperation(value = "Изменение запроса на оценку.")
    @PutMapping("/{id}")
    public BaseResponse updateRequest(@PathVariable Long id,
                                      @RequestBody @Valid EstimationRequestUpdate request) {
        estimationRequestService.updateRequest(id, request);
        return new BaseResponse<>();
    }

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_MANAGER, ROLE_RM, ROLE_SALES})
    @PutMapping("/update_old")
    public BaseResponse updateOldRequest(@RequestBody @Valid EstimationRequestOldDto request) {
        return estimationRequestFacade.updateOldRequest(request);
    }

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_MANAGER, ROLE_RM, ROLE_SALES})
    @ApiOperation(value = "Удаление запроса на оценку.")
    @DeleteMapping("/{id}")
    public BaseResponse delete(@PathVariable Long id) {
        estimationRequestService.deleteRequest(id);
        return new BaseResponse<>();
    }

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_MANAGER, ROLE_RM, ROLE_SALES, ROLE_HR})
    @GetMapping(value = "/{id}/attachments")
    @ApiOperation(value = "Получение всех вложений к запросу на оценку по id.")
    @ApiPageable
    public BaseResponse<Page<FileDto>> getAttachments(@PathVariable("id") Long id, Pageable pageable) {
        return new BaseResponse<>(conversionService.convertToPage(
                pageable, estimationRequestService.getFiles(pageable, id), FileDto.class));
    }

    @ApiOperation(value = "Добавление вложения.")
    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_MANAGER, ROLE_RM, ROLE_SALES, ROLE_HR})
    @PostMapping("/{id}/attachments")
    public BaseResponse<List<FileDto>> attachFileToEstimation(
            @PathVariable Long id, @RequestPart("file") List<MultipartFile> files) {

        return new BaseResponse<>(conversionService.convertToList(
                estimationRequestService.attachMultipleFiles(id, files), FileDto.class));
    }

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_MANAGER, ROLE_RM, ROLE_SALES})
    @ApiOperation(value = "Удаление вложения.")
    @DeleteMapping("/{id}/attachments/{attachmentId}")
    public BaseResponse detachFileToEstimation(
            @PathVariable("id") Long id,
            @PathVariable("attachmentId") Long attachmentId
    ) {
        estimationRequestService.detachFile(id, attachmentId);
        return new BaseResponse();
    }

    @ApiOperation(value = "Добавление оценки.")
    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_MANAGER, ROLE_RM, ROLE_SALES})
    @PostMapping("/{id}/estimations")
    public BaseResponse<FileDto> attachEstimation(@PathVariable Long id, @RequestPart("file") MultipartFile file) {
        return new BaseResponse<>(conversionService.convert(estimationRequestService.attachEstimation(id, file), FileDto.class));
    }

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_MANAGER, ROLE_RM, ROLE_SALES})
    @ApiOperation(value = "Удаление оценки.")
    @DeleteMapping("/{id}/estimations/{estimationId}")
    public BaseResponse deleteEstimation(
            @PathVariable("id") Long id,
            @PathVariable("estimationId") Long estimationId) {
        estimationRequestService.detachEstimation(id, estimationId);
        return new BaseResponse();
    }

    @ApiOperation(value = "Список всех комментариев.")
    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_MANAGER, ROLE_RM, ROLE_SALES})
    @GetMapping("/{id}/comments")
    public BaseResponse<List<CommentResponse>> listComments(@PathVariable("id") Long id) {
        return new BaseResponse<>(conversionService.convertToList(commentService.getEstimationRequestComments(id), CommentResponse.class));
    }

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_MANAGER, ROLE_RM, ROLE_SALES})
    @ApiOperation(value = "Установить сейл.")
    @PutMapping("/{id}/sale")
    public BaseResponse attachToSale(@PathVariable(name = "id") Long requestId,
                                     @RequestBody EstimationRequestAttach attachSale) {
        estimationRequestService.attachToSale(requestId, attachSale.getCompanySaleId());
        return new BaseResponse<>();
    }

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_MANAGER, ROLE_RM, ROLE_SALES})
    @ApiOperation(value = "Отсоединить сейл.")
    @DeleteMapping("/{id}/sale")
    public BaseResponse detachToSale(@PathVariable Long id) {
        estimationRequestService.detachToSale(id);
        return new BaseResponse<>();
    }

    @ApiOperation(value = "Получить комментарий.")
    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_MANAGER, ROLE_RM, ROLE_SALES})
    @GetMapping("/{id}/comments/{commentId}")
    public BaseResponse<CommentResponse> getComment(
            @PathVariable("id") Long id,
            @PathVariable("commentId") Long commentId
    ) {
        return new BaseResponse<>(conversionService.convert(commentService.getComment(id, commentId), CommentResponse.class));
    }

    @ApiOperation(value = "Оставить комментарий.")
    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_MANAGER, ROLE_RM, ROLE_SALES})
    @PostMapping("/{id}/comments")
    public BaseResponse<CommentResponse> leaveComment(@PathVariable("id") Long id,
                                                      @RequestBody CommentCreateRequest request) {
        CommentResponse commentResponse = conversionService.convert(
                commentService.commentEstimationRequest(id, request), CommentResponse.class);
        wsSender.getSender("/topic/estimation_request/comments").accept(commentResponse);
        return new BaseResponse<>(commentResponse);
    }

    @ApiOperation(value = "Обновить комментарий.")
    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_MANAGER, ROLE_RM, ROLE_SALES})
    @PutMapping("/{id}/comments/{commentId}")
    public BaseResponse<CommentResponse> updateComment(
            @PathVariable("id") Long id,
            @PathVariable("commentId") Long commentId,
            @RequestBody CommentUpdateRequest request
    ) {
        CommentResponse commentResponse = conversionService.convert(commentService.updateEstimationRequestComment(id, commentId, request), CommentResponse.class);
        wsSender.getSender("/topic/estimation_request/comments").accept(commentResponse);
        return new BaseResponse<>(commentResponse);
    }

    @ApiOperation(value = "Удалить комментарий.")
    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_MANAGER, ROLE_RM, ROLE_SALES})
    @DeleteMapping("/{id}/comments/{commentId}")
    public BaseResponse deleteComment(@PathVariable("id") Long id, @PathVariable("commentId") Long commentId) {
        commentService.deleteComment(id, commentId);
        Map<String, Long> payload = new LinkedHashMap<>();
        payload.put("requestId", id);
        payload.put("commentId", commentId);
        wsSender.getSender("/topic/estimation_request/deleted").accept(payload);
        return new BaseResponse();
    }
}
