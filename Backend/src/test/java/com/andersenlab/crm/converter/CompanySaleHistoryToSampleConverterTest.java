package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.model.entities.CompanySaleHistory;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.mock;

public class CompanySaleHistoryToSampleConverterTest {

    private final ConversionService conversionService = mock(ConversionService.class);
    private final CompanySaleHistoryToSampleConverter converter = new CompanySaleHistoryToSampleConverter(conversionService);

    @Test
    public void whenGetSourceThenReturnExpectedClass() {
        assertEquals(CompanySaleHistory.class, converter.getSource());
    }
}