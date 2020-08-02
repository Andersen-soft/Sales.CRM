package com.andersenlab.crm.rest.facade;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.exceptions.CrmException;
import com.andersenlab.crm.model.RoleEnum;
import com.andersenlab.crm.model.entities.QResume;
import com.andersenlab.crm.model.entities.Resume;
import com.andersenlab.crm.model.entities.ResumeRequest;
import com.andersenlab.crm.rest.dto.file.FileDto;
import com.andersenlab.crm.rest.request.ResumeDto;
import com.andersenlab.crm.rest.response.ResumeResponse;
import com.andersenlab.crm.security.AuthenticatedUser;
import com.andersenlab.crm.services.EmployeeService;
import com.andersenlab.crm.services.ResumeRequestService;
import com.andersenlab.crm.services.ResumeService;
import com.andersenlab.crm.services.WsSender;
import com.querydsl.core.types.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ResumeFacadeImpl implements ResumeFacade {

    private final ResumeService resumeService;
    private final ResumeRequestService resumeRequestService;
    private final ConversionService conversionService;
    private final AuthenticatedUser authenticatedUser;
    private final EmployeeService employeeService;
    private final WsSender wsSender;

    @Override
    public ResumeResponse create(Long resumeRequestId, ResumeDto request, MultipartFile[] files) {
        validateCreate(resumeRequestId, request);
        Resume entity = conversionService.convert(request, Resume.class);
        entity.setAuthor(authenticatedUser.getCurrentEmployee());
        entity.setResumeRequest(new ResumeRequest(resumeRequestId));
        ResumeResponse resumeResponse = conversionService.convert(resumeService.createResume(entity, files), ResumeResponse.class);
        wsSender.getSender("/topic/resume_request/resume/create").accept(resumeResponse);
        return resumeResponse;
    }

    @Override
    public ResumeResponse update(Long id, ResumeDto request) {
        validateUpdate(id, request);
        Resume entity = conversionService.convert(request, Resume.class);
        ResumeResponse resumeResponse = conversionService.convert(resumeService.updateResume(id, entity), ResumeResponse.class);
        wsSender.getSender("/topic/resume_request/resume/update").accept(resumeResponse);
        return resumeResponse;
    }

    @Override
    public FileDto attachFile(Long id, MultipartFile file) {
        FileDto fileDto = conversionService.convert(resumeService.attachFileToResume(id, file), FileDto.class);
        wsSender.getSender("/topic/resume_request/resume_file").accept(fileDto);
        return fileDto;
    }

    @Override
    public void detachFile(Long resumeId, Long fileId) {
        validateDetachFile(resumeId, fileId);
        resumeService.detachFileFromResume(fileId);
        Map<String, Long> parameters = new LinkedHashMap<>();
        parameters.put("requestId", resumeId);
        parameters.put("fileId", fileId);
        wsSender.getSender("/topic/resume_request/deleted_resume_file").accept(parameters);
    }

    @Override
    public void delete(Long id) {
        resumeService.validateById(id);
        resumeService.deleteResume(id);
        Map<String, Long> parameters = new LinkedHashMap<>();
        parameters.put("requestId", id);
        wsSender.getSender("/topic/resume_request/deleted_resume").accept(parameters);
    }

    @Override
    public Page<ResumeResponse> get(Predicate predicate, Pageable pageable) {
        return conversionService.convertToPage(pageable, resumeService.getResumeWithFilter(predicate, pageable), ResumeResponse.class);
    }

    private void validateDetachFile(Long resumeId, Long fileId) {
        if (!resumeService.exists(QResume.resume.id.eq(resumeId).and(QResume.resume.files.any().id.eq(fileId)))) {
            throw new CrmException("Файл с id= " + fileId + " не прикреплен к даному резюме.");
        }
    }

    private void validateCreate(Long resumeRequestId, ResumeDto dto) {
        resumeRequestService.validateById(resumeRequestId);
        validateOnDeletionResponsibleHr(dto);
    }

    private void validateUpdate(Long id, ResumeDto dto) {
        resumeService.validateById(id);
        validateOnDeletionResponsibleHr(dto);
    }

    private void validateOnDeletionResponsibleHr(ResumeDto dto) {
        Optional.ofNullable(dto.getResponsibleHrId())
                .ifPresent(hrId -> {
                    if (hrId != -1) {
                        employeeService.validateByIdAndRole(hrId, RoleEnum.ROLE_HR);
                    }
                });
    }
}
