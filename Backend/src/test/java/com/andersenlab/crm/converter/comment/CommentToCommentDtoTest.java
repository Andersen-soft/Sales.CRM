package com.andersenlab.crm.converter.comment;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.model.entities.ResumeRequestComment;
import com.andersenlab.crm.rest.dto.CommentDto;
import org.junit.Before;
import org.junit.Test;

import java.time.LocalDateTime;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.Mockito.mock;

public class CommentToCommentDtoTest {

    private final ConversionService conversionService = mock(ConversionService.class);
    private CommentToCommentDto converter;
    private ResumeRequestComment comment;

    @Before
    public void setUp() {
        converter = new CommentToCommentDto(conversionService);
        comment = getResumeRequestComment();
    }

    @Test
    public void whenGetClassesThenReturnExpected() {
        assertEquals(converter.getSource(), ResumeRequestComment.class);
        assertEquals(converter.getTarget(), CommentDto.class);
    }

    @Test
    public void convert() {
        CommentDto result = converter.convert(comment);
        assertNotNull(result);
        assertEquals("ResumeRequestComment id", comment.getId(), result.getId());
        assertEquals("ResumeRequestComment name", comment.getDescription(), result.getDescription());
        assertEquals("ResumeRequestComment status", comment.getCreateDate(), result.getCreated());
    }

    private ResumeRequestComment getResumeRequestComment() {
        ResumeRequestComment resumeRequestComment = new ResumeRequestComment();
        resumeRequestComment.setId(100L);
        resumeRequestComment.setDescription("Мой комментарий необходимо удалить!");
        resumeRequestComment.setCreateDate(LocalDateTime.now());
        resumeRequestComment.setEmployee(new Employee(1L));
        return resumeRequestComment;
    }
}
