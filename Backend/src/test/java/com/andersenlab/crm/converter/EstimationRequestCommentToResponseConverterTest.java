package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.model.entities.EstimationRequestComment;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.mock;

public class EstimationRequestCommentToResponseConverterTest {

    private ConversionService conversionService = mock(ConversionService.class);
    private EstimationRequestCommentToResponseConverter converter = new EstimationRequestCommentToResponseConverter(conversionService);

    @Test
    public void testGetSource() {
        Class<EstimationRequestComment> expectedResult = EstimationRequestComment.class;

        Class<EstimationRequestComment> result = converter.getSource();

        assertEquals(expectedResult, result);
    }
}