package com.andersenlab.crm.services;

import com.andersenlab.crm.model.entities.File;
import com.andersenlab.crm.model.entities.ResumeRequest;
import com.andersenlab.crm.model.entities.ResumeRequestComment;
import com.andersenlab.crm.model.entities.ResumeRequestHistory;
import com.querydsl.core.types.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ResumeRequestService {

    /**
     * Saves a given saleObjectId request
     *
     * @param request the request to save
     */
    ResumeRequest create(ResumeRequest request, MultipartFile[] files);

    List<String> getPriorities();

    List<String> getStatuses();

    File attacheFile(Long id, MultipartFile file);

    ResumeRequest findRequestByIdOrThrow(Long id);

    void setDoneDateOrNull(ResumeRequest request);

    ResumeRequest create(ResumeRequest entity);

    ResumeRequest update(ResumeRequest entity);

    void validateById(Long id);

    Page<ResumeRequest> get(Predicate predicate, Pageable pageable);

    void delete(Long id);

    void deleteFile(Long id, Long fileId);

    Page<ResumeRequestHistory> getHistories(Pageable pageable, Long id);

    Page<File> getFiles(Pageable pageable, Long id);

    Page<ResumeRequestComment> getComments(Pageable pageable, Long id);
}
