package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.model.entities.ResumeComment;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.mock;

public class ResumeCommentToResponseConverterTest {

    private ConversionService conversionService = mock(ConversionService.class);
    private ResumeCommentToResponseConverter converter = new ResumeCommentToResponseConverter(conversionService);

    @Test
    public void testGetSource() {
        Class<ResumeComment> expectedResult = ResumeComment.class;

        Class<ResumeComment> result = converter.getSource();

        assertEquals(expectedResult, result);
    }
}