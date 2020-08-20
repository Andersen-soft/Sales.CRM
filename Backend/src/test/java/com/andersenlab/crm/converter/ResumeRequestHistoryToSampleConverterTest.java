package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.model.entities.ResumeRequestHistory;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.mock;

public class ResumeRequestHistoryToSampleConverterTest {

    private final ConversionService conversionService = mock(ConversionService.class);
    private final ResumeRequestHistoryToSampleConverter converter = new ResumeRequestHistoryToSampleConverter(conversionService);

    @Test
    public void whenGetSourceThenReturnExpectedClass() {
        assertEquals(ResumeRequestHistory.class, converter.getSource());
    }
}