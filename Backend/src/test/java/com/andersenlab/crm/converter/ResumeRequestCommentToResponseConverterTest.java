package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.model.entities.ResumeRequestComment;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.mock;

public class ResumeRequestCommentToResponseConverterTest {

    private ConversionService conversionService = mock(ConversionService.class);
    private ResumeRequestCommentToResponseConverter converter = new ResumeRequestCommentToResponseConverter(conversionService);

    @Test
    public void testGetSource() {
        Class<ResumeRequestComment> expectedResult = ResumeRequestComment.class;

        Class<ResumeRequestComment> result = converter.getSource();

        assertEquals(expectedResult, result);
    }
}