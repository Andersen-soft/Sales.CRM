package com.andersenlab.crm.converter;

import com.andersenlab.crm.model.entities.ResumeComment;
import com.andersenlab.crm.rest.request.CommentCreateRequest;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class CommentCreateRequestToResumeCommentConverterTest {

    private static final String COMMENT_DESCRIPTION = "Resume comment description";

    private final CommentCreateRequestToResumeCommentConverter converter = new CommentCreateRequestToResumeCommentConverter();

    @Test
    public void testConvert() {
        CommentCreateRequest source = new CommentCreateRequest();
        source.setDescription(COMMENT_DESCRIPTION);

        ResumeComment result = converter.convert(source);

        assertEquals(source.getDescription(), result.getDescription());
    }

    @Test
    public void testGetSource() {
        Class<CommentCreateRequest> expectedResult = CommentCreateRequest.class;

        Class<CommentCreateRequest> result = converter.getSource();

        assertEquals(expectedResult, result);
    }

    @Test
    public void testGetTarget() {
        Class<ResumeComment> expectedResult = ResumeComment.class;

        Class<ResumeComment> result = converter.getTarget();

        assertEquals(expectedResult, result);
    }
}