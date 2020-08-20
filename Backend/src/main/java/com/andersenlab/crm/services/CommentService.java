package com.andersenlab.crm.services;

import com.andersenlab.crm.model.entities.Comment;
import com.andersenlab.crm.model.entities.EstimationRequestComment;
import com.andersenlab.crm.model.entities.ResumeRequestComment;
import com.andersenlab.crm.rest.request.CommentCreateRequest;
import com.andersenlab.crm.rest.request.CommentUpdateRequest;

import java.util.List;

public interface CommentService {

    Comment getComment(Long estimationId, Long commentId);

    List<EstimationRequestComment> getEstimationRequestComments(Long id);

    EstimationRequestComment commentEstimationRequest(Long id, CommentCreateRequest request);

    EstimationRequestComment updateEstimationRequestComment(Long estimationId, Long commentId, CommentUpdateRequest request);

    void deleteComment(Long estimationId, Long commentId);

    ResumeRequestComment createResumeRequestComment(ResumeRequestComment comment);

    ResumeRequestComment updateResumeRequestComment(ResumeRequestComment entity);

    void deleteResumeRequestComment(Long id, Long resumeRequestId);
}
