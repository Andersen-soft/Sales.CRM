package com.andersenlab.crm.repositories;

import com.andersenlab.crm.model.entities.QResumeRequestComment;
import com.andersenlab.crm.model.entities.ResumeRequestComment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ResumeRequestCommentRepository extends BaseRepository<QResumeRequestComment, ResumeRequestComment, Long> {

    Page<ResumeRequestComment> findByResumeRequestId(Pageable pageable, Long id);
}
