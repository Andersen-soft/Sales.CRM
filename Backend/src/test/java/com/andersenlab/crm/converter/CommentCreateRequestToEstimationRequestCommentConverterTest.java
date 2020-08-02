package com.andersenlab.crm.converter;

import com.andersenlab.crm.model.entities.EstimationRequestComment;
import com.andersenlab.crm.rest.request.CommentCreateRequest;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class CommentCreateRequestToEstimationRequestCommentConverterTest {

    private static final String COMMENT_DESCRIPTION = "Estimation request comment description";

    private final CommentCreateRequestToEstimationRequestCommentConverter converter = new CommentCreateRequestToEstimationRequestCommentConverter();

    @Test
    public void testConvert() {
        CommentCreateRequest source = new CommentCreateRequest();
        source.setDescription(COMMENT_DESCRIPTION);

        EstimationRequestComment result = converter.convert(source);

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
        Class<EstimationRequestComment> expectedResult = EstimationRequestComment.class;

        Class<EstimationRequestComment> result = converter.getTarget();

        assertEquals(expectedResult, result);
    }
}