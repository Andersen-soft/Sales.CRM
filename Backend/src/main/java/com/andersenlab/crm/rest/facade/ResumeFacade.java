package com.andersenlab.crm.rest.facade;

import com.andersenlab.crm.rest.dto.file.FileDto;
import com.andersenlab.crm.rest.request.ResumeDto;
import com.andersenlab.crm.rest.response.ResumeResponse;
import com.querydsl.core.types.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

public interface ResumeFacade {

    ResumeResponse create(Long resumeRequestId, ResumeDto request, MultipartFile[] files);

    ResumeResponse update(Long id, ResumeDto request);

    FileDto attachFile(Long id, MultipartFile file);

    void detachFile(Long resumeId, Long fileId);

    void delete(Long id);

    Page<ResumeResponse> get(Predicate predicate, Pageable pageable);
}
