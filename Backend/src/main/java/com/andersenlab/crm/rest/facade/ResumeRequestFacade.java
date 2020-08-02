package com.andersenlab.crm.rest.facade;

import com.andersenlab.crm.rest.dto.CommentDto;
import com.andersenlab.crm.rest.dto.file.FileDto;
import com.andersenlab.crm.rest.dto.history.HistoryDto;
import com.andersenlab.crm.rest.dto.resumerequest.ResumeRequestDtoUpdate;
import com.andersenlab.crm.rest.request.CommentCreateRequest;
import com.andersenlab.crm.rest.request.ResumeRequestCreateRequest;
import com.andersenlab.crm.rest.response.ResumeRequestDto;
import com.querydsl.core.types.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Locale;

public interface ResumeRequestFacade {

    ResumeRequestDto create(ResumeRequestCreateRequest dto, MultipartFile[] files);

    ResumeRequestDto getByID(Long id);

    Page<ResumeRequestDto> get(Predicate predicate, Pageable pageable);

    ResumeRequestDto update(Long id, ResumeRequestDtoUpdate dto);

    void delete(Long id);

    FileDto attacheFile(Long id, MultipartFile file);

    List<FileDto> attachMultipleFiles(Long id, List<MultipartFile> files);

    Page<FileDto> getFiles(Pageable pageable, Long id);

    void deleteFile(Long id, Long fileId);

    CommentDto createComment(Long id, CommentCreateRequest dto);

    CommentDto updateComment(Long id, Long commentId, CommentCreateRequest dto);

    Page<CommentDto> getComments(Pageable pageable, Long id);

    void deleteComment(Long id, Long commentId);

    Page<HistoryDto> getHistory(Long id, Pageable pageable, Locale locale);
}
