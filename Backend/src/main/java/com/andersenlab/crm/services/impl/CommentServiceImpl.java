package com.andersenlab.crm.services.impl;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.events.EstimationRequestCommentedEvent;
import com.andersenlab.crm.events.ResumeRequestCommentedEvent;
import com.andersenlab.crm.exceptions.CrmException;
import com.andersenlab.crm.exceptions.OutsiderAccessException;
import com.andersenlab.crm.exceptions.ResourceNotFoundException;
import com.andersenlab.crm.model.EventType;
import com.andersenlab.crm.model.entities.Comment;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.model.entities.EstimationRequest;
import com.andersenlab.crm.model.entities.EstimationRequestComment;
import com.andersenlab.crm.model.entities.ResumeRequest;
import com.andersenlab.crm.model.entities.ResumeRequestComment;
import com.andersenlab.crm.repositories.CommentRepository;
import com.andersenlab.crm.repositories.EstimationRequestCommentRepository;
import com.andersenlab.crm.repositories.EstimationRequestRepository;
import com.andersenlab.crm.repositories.ResumeRequestCommentRepository;
import com.andersenlab.crm.rest.request.CommentCreateRequest;
import com.andersenlab.crm.rest.request.CommentUpdateRequest;
import com.andersenlab.crm.security.AuthenticatedUser;
import com.andersenlab.crm.services.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

import static com.andersenlab.crm.utils.CrmStringUtils.fixStringDescription;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    public static final String REQUEST_ID_ERROR = "Этот комментарий не пренадлежит данному запросу на оценку";

    private final CommentRepository commentRepository;
    private final EstimationRequestCommentRepository estimationRequestCommentRepository;
    private final ConversionService conversionService;
    private final EstimationRequestRepository estimationRequestRepository;
    private final AuthenticatedUser authenticatedUser;
    private final ResumeRequestCommentRepository resumeRequestCommentRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    @Transactional
    public EstimationRequestComment commentEstimationRequest(Long id, CommentCreateRequest request) {
        request.setDescription(fixStringDescription(request.getDescription()));
        EstimationRequest estimationRequest = findEstimationRequest(id);
        EstimationRequestComment comment = conversionService.convert(request, EstimationRequestComment.class);
        comment.setEstimationRequest(estimationRequest);
        comment.setEmployee(authenticatedUser.getCurrentEmployee());
        EstimationRequestComment persisted = commentRepository.saveAndFlush(comment);

        eventPublisher.publishEvent(EstimationRequestCommentedEvent
                .builder()
                .commentId(persisted.getId())
                .text(persisted.getDescription())
                .eventType(EventType.CREATE)
                .build());

        return persisted;
    }

    private EstimationRequest findEstimationRequest(Long id) {
        return Optional.ofNullable(estimationRequestRepository.findOne(id))
                .orElseThrow(() -> new ResourceNotFoundException("Estimation request not found"));
    }

    @Override
    public Comment getComment(Long estimationId, Long id) {
        Comment comment = findComment(id);
        EstimationRequest estimationRequest = ((EstimationRequestComment) comment).getEstimationRequest();
        if (estimationRequest != null && !Objects.equals(estimationRequest.getId(), estimationId)) {
            throw new CrmException(REQUEST_ID_ERROR);
        }
        return comment;
    }

    @Override
    public List<EstimationRequestComment> getEstimationRequestComments(Long id) {
        EstimationRequest estimationRequest = findEstimationRequest(id);
        return estimationRequest.getComments();
    }

    @Override
    @Transactional
    public EstimationRequestComment updateEstimationRequestComment(Long estimationId, Long id, CommentUpdateRequest request) {
        EstimationRequestComment comment = findEstimationRequestComment(id);
        request.setDescription(fixStringDescription(request.getDescription()));
        Employee persistedEmployee = comment.getEmployee();
        EstimationRequest estimationRequest = comment.getEstimationRequest();
        if (persistedEmployee != null
                && !persistedEmployee.getId().equals(authenticatedUser.getCurrentEmployee().getId())) {
            throw new CrmException("Редактировать комментарий может только создатель");
        }
        if (estimationRequest != null && !Objects.equals(estimationRequest.getId(), estimationId)) {
            throw new CrmException(REQUEST_ID_ERROR);
        }
        comment.setDescription(request.getDescription());

        eventPublisher.publishEvent(EstimationRequestCommentedEvent
                .builder()
                .commentId(comment.getId())
                .text(comment.getDescription())
                .eventType(EventType.UPDATE)
                .build());

        return estimationRequestCommentRepository.saveAndFlush(comment);
    }

    private EstimationRequestComment findEstimationRequestComment(Long id) {
        return Optional.ofNullable(estimationRequestCommentRepository.findOne(id))
                .orElseThrow(() -> new ResourceNotFoundException("Estimation comment not found"));
    }

    private Comment findComment(Long id) {
        return Optional.ofNullable(commentRepository.findOne(id))
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));
    }

    @Override
    public void deleteComment(Long estimationId, Long id) {
        Comment comment = findComment(id);
        Employee persistedEmployee = comment.getEmployee();
        EstimationRequest estimationRequest = ((EstimationRequestComment) comment).getEstimationRequest();
        if (persistedEmployee != null
                && !persistedEmployee.getId().equals(authenticatedUser.getCurrentEmployee().getId())) {
            throw new CrmException("Удалить комментарий может только создатель");
        }
        if (estimationRequest != null && !Objects.equals(estimationRequest.getId(), estimationId)) {
            throw new CrmException(REQUEST_ID_ERROR);
        }
        commentRepository.delete(id);
    }

    @Override
    @Transactional
    public ResumeRequestComment createResumeRequestComment(ResumeRequestComment comment) {
        ResumeRequestComment persisted = resumeRequestCommentRepository.save(comment);

        eventPublisher.publishEvent(ResumeRequestCommentedEvent
                .builder()
                .commentId(persisted.getId())
                .text(persisted.getDescription())
                .eventType(EventType.CREATE)
                .build());

        return persisted;
    }

    @Override
    @Transactional
    public ResumeRequestComment updateResumeRequestComment(ResumeRequestComment entity) {
        ResumeRequestComment persisted = findResumeRequestComment(entity.getId());
        validateEmployee(persisted.getEmployee(), entity.getEmployee());
        validateResumeRequest(persisted.getResumeRequest(), entity.getResumeRequest());
        persisted.setDescription(entity.getDescription());
        updateEditingStatus(persisted, entity);

        eventPublisher.publishEvent(ResumeRequestCommentedEvent
                .builder()
                .commentId(persisted.getId())
                .text(persisted.getDescription())
                .eventType(EventType.UPDATE)
                .build());

        return resumeRequestCommentRepository.saveAndFlush(persisted);
    }

    @Override
    @Transactional
    public void deleteResumeRequestComment(Long id, Long resumeRequestId) {
        ResumeRequestComment persisted = findResumeRequestComment(id);
        validateEmployee(persisted.getEmployee(), authenticatedUser.getCurrentEmployee());
        commentRepository.delete(persisted);
    }

    private ResumeRequestComment findResumeRequestComment(Long id) {
        return Optional.ofNullable(resumeRequestCommentRepository.findOne(id))
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));
    }

    private void validateEmployee(Employee persisted, Employee authenticated) {//
        if (!persisted.getId().equals(authenticated.getId())) {
            throw new OutsiderAccessException("Пользователь [%s - %s] не является создателем.", authenticated.getId(), authenticated.getLastName());
        }
    }

    private void validateResumeRequest(ResumeRequest persisted, ResumeRequest entity) {
        if (!persisted.getId().equals(entity.getId())) {
            throw new IllegalStateException("Комментарий не принадлежит этому запросу на резюме.");
        }
    }

    private void updateEditingStatus(ResumeRequestComment persisted, ResumeRequestComment entity) {
        persisted.setIsEdited(!persisted.getDescription().equals(entity.getDescription()));
    }
}
