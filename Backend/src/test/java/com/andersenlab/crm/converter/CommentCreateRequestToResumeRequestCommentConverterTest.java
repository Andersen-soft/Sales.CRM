package com.andersenlab.crm.converter;

import com.andersenlab.crm.model.entities.ResumeRequestComment;
import com.andersenlab.crm.rest.request.CommentCreateRequest;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class CommentCreateRequestToResumeRequestCommentConverterTest {

    private static final String COMMENT_DESCRIPTION = "Resume request comment description";

    private final CommentCreateRequestToResumeRequestCommentConverter converter = new CommentCreateRequestToResumeRequestCommentConverter();

    @Test
    public void testConvert() {
        CommentCreateRequest source = new CommentCreateRequest();
        source.setDescription(COMMENT_DESCRIPTION);

        ResumeRequestComment result = converter.convert(source);

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
        Class<ResumeRequestComment> expectedResult = ResumeRequestComment.class;

        Class<ResumeRequestComment> result = converter.getTarget();

        assertEquals(expectedResult, result);
    }
}