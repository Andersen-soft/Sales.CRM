package com.andersenlab.crm.services.impl;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.exceptions.ResourceNotFoundException;
import com.andersenlab.crm.model.entities.EstimationRequest;
import com.andersenlab.crm.model.entities.EstimationRequestComment;
import com.andersenlab.crm.repositories.CommentRepository;
import com.andersenlab.crm.repositories.EstimationRequestCommentRepository;
import com.andersenlab.crm.repositories.EstimationRequestRepository;
import com.andersenlab.crm.repositories.ResumeRequestCommentRepository;
import com.andersenlab.crm.rest.request.CommentCreateRequest;
import com.andersenlab.crm.rest.request.CommentUpdateRequest;
import com.andersenlab.crm.security.AuthenticatedUser;
import org.junit.Test;
import org.springframework.context.ApplicationEventPublisher;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertSame;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import java.util.ArrayList;
import java.util.List;

public class CommentServiceImplTest {

    private final CommentRepository commentRepository = mock(CommentRepository.class);
    private final EstimationRequestCommentRepository estimationRequestCommentRepository = mock(EstimationRequestCommentRepository.class);
    private final ConversionService conversionService = mock(ConversionService.class);
    private final EstimationRequestRepository estimationRequestRepository = mock(EstimationRequestRepository.class);
    private final AuthenticatedUser authenticatedUser = mock(AuthenticatedUser.class);
    private final ResumeRequestCommentRepository resumeRequestCommentRepository = mock(ResumeRequestCommentRepository.class);
    private final ApplicationEventPublisher eventPublisher = mock(ApplicationEventPublisher.class);
    private String textForDescription = "description";

    private final CommentServiceImpl commentService = new CommentServiceImpl(commentRepository,
            estimationRequestCommentRepository,
            conversionService,
            estimationRequestRepository,
            authenticatedUser,
            resumeRequestCommentRepository,
            eventPublisher);


    @Test
    public void whenCommentEstimationRequestThenCommentCreated() {
        EstimationRequest estimationRequest = new EstimationRequest();
        CommentCreateRequest request = new CommentCreateRequest();
        EstimationRequestComment comment = new EstimationRequestComment();
        comment.setId(1L);
        comment.setDescription(textForDescription);
        given(conversionService.convert(request, EstimationRequestComment.class)).willReturn(comment);
        given(estimationRequestRepository.findOne(1L)).willReturn(estimationRequest);
        given(commentRepository.saveAndFlush(any(EstimationRequestComment.class))).willReturn(comment);
        commentService.commentEstimationRequest(1L, request);
        assertSame(comment.getEstimationRequest(), estimationRequest);
        verify(commentRepository, times(1)).saveAndFlush(comment);
    }

    @Test
    public void getEstimationRequestComments() {
        EstimationRequest estimationRequest = new EstimationRequest();
        List<EstimationRequestComment> comments = new ArrayList<>();
        EstimationRequestComment comment = new EstimationRequestComment();
        comment.setDescription(textForDescription);
        comments.add(comment);
        estimationRequest.setComments(comments);
        given(estimationRequestRepository.findOne(1L)).willReturn(estimationRequest);
        List<EstimationRequestComment> result = commentService.getEstimationRequestComments(1L);
        assertSame(result, comments);
    }

    @Test
    public void whenDeleteCommentThenExpectedInvoked() {
        EstimationRequestComment comment = new EstimationRequestComment();
        EstimationRequest request = new EstimationRequest();
        request.setId(1L);
        comment.setEstimationRequest(request);
        given(commentRepository.findOne(1L)).willReturn(comment);
        commentService.deleteComment(1L, 1L);
        verify(commentRepository, times(1)).delete(1L);
    }

    @Test(expected = ResourceNotFoundException.class)
    public void whenAddCommentToEstimationRequestThenExceptionExpected() {
        CommentCreateRequest request = new CommentCreateRequest();
        EstimationRequestComment comment = new EstimationRequestComment();
        given(conversionService.convert(request, EstimationRequestComment.class)).willReturn(comment);
        given(estimationRequestRepository.findOne(1L)).willReturn(null);
        commentService.commentEstimationRequest(1L, request);
    }

    @Test(expected = ResourceNotFoundException.class)
    public void updateCommentAndNoCommentExceptionExpected() {
        CommentUpdateRequest commentUpdateRequest = new CommentUpdateRequest();
        given(commentRepository.findOne(1L)).willReturn(null);
        commentService.updateEstimationRequestComment(1L, 1L, commentUpdateRequest);
    }

    @Test(expected = ResourceNotFoundException.class)
    public void deleteComment() {
        given(commentRepository.findOne(1L)).willReturn(null);
        commentService.deleteComment(1L, 1L);
    }
}