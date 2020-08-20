package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.model.entities.ResumeHistory;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.mock;

public class ResumeHistoryToHistorySampleConverterTest {
    private final ConversionService conversionService = mock(ConversionService.class);
    private final ResumeHistoryToHistorySampleConverter converter = new ResumeHistoryToHistorySampleConverter(conversionService);

    @Test
    public void whenGetSourceThenReturnExpectedClass() {
        assertEquals(ResumeHistory.class, converter.getSource());
    }
}