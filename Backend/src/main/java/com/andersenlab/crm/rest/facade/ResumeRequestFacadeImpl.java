package com.andersenlab.crm.rest.facade;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.exceptions.CrmException;
import com.andersenlab.crm.exceptions.OutsiderAccessException;
import com.andersenlab.crm.model.entities.Company;
import com.andersenlab.crm.model.entities.CompanySale;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.model.entities.File;
import com.andersenlab.crm.model.entities.ResumeRequest;
import com.andersenlab.crm.model.entities.ResumeRequestComment;
import com.andersenlab.crm.model.entities.ResumeRequestHistory;
import com.andersenlab.crm.model.entities.SaleRequest;
import com.andersenlab.crm.publishers.ResumeRequestEventPublisher;
import com.andersenlab.crm.rest.dto.CommentDto;
import com.andersenlab.crm.rest.dto.file.FileDto;
import com.andersenlab.crm.rest.dto.history.HistoryDto;
import com.andersenlab.crm.rest.dto.resumerequest.ResumeRequestDtoUpdate;
import com.andersenlab.crm.rest.dto.resumerequest.ResumeRequestUpdateNameOrDeadlineDto;
import com.andersenlab.crm.rest.request.CommentCreateRequest;
import com.andersenlab.crm.rest.request.ResumeRequestCreateRequest;
import com.andersenlab.crm.rest.response.ResumeRequestDto;
import com.andersenlab.crm.security.AuthenticatedUser;
import com.andersenlab.crm.services.CommentService;
import com.andersenlab.crm.services.CompanySaleServiceNew;
import com.andersenlab.crm.services.CompanyService;
import com.andersenlab.crm.services.ResumeRequestService;
import com.andersenlab.crm.services.WsSender;
import com.querydsl.core.types.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.andersenlab.crm.utils.CrmStringUtils.fixStringDescription;

@Service
@RequiredArgsConstructor
public class ResumeRequestFacadeImpl implements ResumeRequestFacade {

    private static final String REQUEST_ID = "requestId";

    private final ResumeRequestService resumeRequestService;
    private final ConversionService converter;
    private final CompanyService companyService;
    private final AuthenticatedUser authenticatedUser;
    private final CommentService commentService;
    private final CompanySaleServiceNew companySaleServiceNew;
    private final WsSender wsSender;
    private final ResumeRequestEventPublisher resumeRequestEventPublisher;

    @Override
    public ResumeRequestDto create(ResumeRequestCreateRequest dto, MultipartFile[] files) {
        Company company = companyService.findCompanyByIdOrThrowException(dto.getCompanyId());
        if (company.getResponsible() == null) {
            List<ResumeRequest> countOfExistedResumeRequests = company.getCompanySales().stream()
                    .map(CompanySale::getResumeRequests)
                    .flatMap(Collection::stream)
                    .filter(SaleRequest::getIsActive)
                    .collect(Collectors.toList());
            if (!ObjectUtils.isEmpty(countOfExistedResumeRequests)) {
                throw new CrmException("Попытка добавления запроса на резюме для компании у которой нет ответсвенного ресурсного менеджера.");
            }
        }
        ResumeRequest resumeRequest = converter.convert(dto, ResumeRequest.class);
        Employee employee = authenticatedUser.getCurrentEmployee();
        CompanySale companySale = companySaleServiceNew.findCompanySaleByIdOrThrowException(dto.getCompanySale());
        resumeRequest.setCompanySale(companySale);
        resumeRequest.setAuthor(employee);
        resumeRequest.setResponsibleForSaleRequest(employee);
        resumeRequest.getComments().forEach(c -> {
            c.setEmployee(employee);
            c.setResumeRequest(resumeRequest);
        });

        ResumeRequest resultRequest = resumeRequestService.create(resumeRequest, files);
        ResumeRequestDto resumeRequestDto = converter.convert(resultRequest, ResumeRequestDto.class);
        resumeRequestEventPublisher.publishResumeRequestCreatedEvent(resultRequest);

        return resumeRequestDto;
    }

    @Override
    public ResumeRequestDto getByID(Long id) {
        ResumeRequest resumeRequest = resumeRequestService.findRequestByIdOrThrow(id);
        return converter.convert(resumeRequest, ResumeRequestDto.class);
    }

    @Override
    public Page<ResumeRequestDto> get(Predicate predicate, Pageable pageable) {
        Page<ResumeRequest> resumeRequests = resumeRequestService.get(predicate, pageable);
        return converter.convertToPage(pageable, resumeRequests, ResumeRequestDto.class);
    }

    @Override
    public ResumeRequestDto update(Long id, ResumeRequestDtoUpdate dto) {
        resumeRequestService.validateById(id);
        ResumeRequest entity = converter.convert(dto, ResumeRequest.class);
        entity.setId(id);
        ResumeRequest oldEntity = resumeRequestService.findRequestByIdOrThrow(id);

        ResumeRequestUpdateNameOrDeadlineDto.ResumeRequestUpdateNameOrDeadlineDtoBuilder builder
                = ResumeRequestUpdateNameOrDeadlineDto.builder()
                .id(id)
                .oldName(oldEntity.getName())
                .oldDeadline(oldEntity.getDeadline());

        ResumeRequestDto resumeRequestDto = converter.convert(resumeRequestService.update(entity), ResumeRequestDto.class);

        if (Optional.ofNullable(dto.getDeadLine()).isPresent()
                || Optional.ofNullable(dto.getName()).isPresent()) {
            wsSender.getSender("/topic/resume_request/update/name_or_deadline")
                    .accept(
                            builder
                                    .name(entity.getName())
                                    .deadline(entity.getDeadline())
                                    .build()
                    );
        }

        wsSender.getSender("/topic/resume_request/update").accept(resumeRequestDto);
        return resumeRequestDto;
    }

    @Override
    public void delete(Long id) {
        resumeRequestService.delete(id);
        Map<String, Long> parameters = new LinkedHashMap<>();
        parameters.put(REQUEST_ID, id);
        wsSender.getSender("/topic/resume_request/deleted_resume").accept(parameters);
    }

    @Override
    public FileDto attacheFile(Long id, MultipartFile file) {
        FileDto fileDto = converter.convert(resumeRequestService.attacheFile(id, file), FileDto.class);
        wsSender.getSender("/topic/resume_request/resume_file").accept(fileDto);
        return fileDto;
    }

    @Override
    public List<FileDto> attachMultipleFiles(Long id, List<MultipartFile> files) {
        return files.stream()
                .map(file -> attacheFile(id, file))
                .collect(Collectors.toList());
    }

    @Override
    public Page<FileDto> getFiles(Pageable pageable, Long id) {
        Page<File> files = resumeRequestService.getFiles(pageable, id);
        return converter.convertToPage(pageable, files, FileDto.class);
    }

    @Override
    public void deleteFile(Long id, Long fileId) {
        resumeRequestService.deleteFile(id, fileId);
        Map<String, Long> parameters = new LinkedHashMap<>();
        parameters.put(REQUEST_ID, id);
        parameters.put("fileId", fileId);
        wsSender.getSender("/topic/resume_request/deleted_resume_file").accept(parameters);
    }

    @Override
    @Transactional
    public CommentDto createComment(Long id, CommentCreateRequest dto) {
        dto.setDescription(fixStringDescription(dto.getDescription()));
        ResumeRequestComment comment = converter.convert(dto, ResumeRequestComment.class);
        ResumeRequest resumeRequest = resumeRequestService.findRequestByIdOrThrow(id);
        comment.setResumeRequest(resumeRequest);
        comment.setEmployee(authenticatedUser.getCurrentEmployee());
        if (resumeRequest.getResponsibleRM() == authenticatedUser.getCurrentEmployee()) {
            resumeRequest.setAutoDistribution(false);
            if (Boolean.TRUE.equals(authenticatedUser.getCurrentEmployee().getResponsibleRM())) {
                resumeRequest.getCompany().setResponsible(authenticatedUser.getCurrentEmployee());
            }
        }
        CommentDto commentDto = converter.convert(commentService.createResumeRequestComment(comment), CommentDto.class);
        wsSender.getSender("/topic/resume_request/comments").accept(commentDto);
        return commentDto;
    }

    @Override
    public CommentDto updateComment(Long id, Long commentId, CommentCreateRequest dto) {
        dto.setDescription(fixStringDescription(dto.getDescription()));
        ResumeRequestComment comment = converter.convert(dto, ResumeRequestComment.class);
        comment.setId(commentId);
        comment.setResumeRequest(resumeRequestService.findRequestByIdOrThrow(id));
        comment.setEmployee(authenticatedUser.getCurrentEmployee());
        try {
            CommentDto commentDto = converter.convert(commentService.updateResumeRequestComment(comment), CommentDto.class);
            wsSender.getSender("/topic/resume_request/comments").accept(commentDto);
            return commentDto;
        } catch (OutsiderAccessException e) {
            throw new IllegalStateException("Редактировать комментарий может только создатель.", e);
        }

    }

    @Override
    public void deleteComment(Long id, Long commentId) {
        try {
            commentService.deleteResumeRequestComment(commentId, id);
            Map<String, Long> payload = new LinkedHashMap<>();
            payload.put(REQUEST_ID, id);
            payload.put("commentId", commentId);
            wsSender.getSender("/topic/resume_request/deleted").accept(payload);
        } catch (OutsiderAccessException e) {
            throw new IllegalStateException("Удалить комментарий может только создатель.", e);
        }
    }

    @Override
    public Page<CommentDto> getComments(Pageable pageable, Long id) {
        Page<ResumeRequestComment> comments = resumeRequestService.getComments(pageable, id);
        return converter.convertToPage(pageable, comments, CommentDto.class);
    }

    @Override
    public Page<HistoryDto> getHistory(Long id, Pageable pageable, Locale locale) {
        Page<ResumeRequestHistory> histories = resumeRequestService.getHistories(pageable, id);
        return converter.convertToPageWithLocale(pageable, histories, HistoryDto.class, locale);
    }
}
