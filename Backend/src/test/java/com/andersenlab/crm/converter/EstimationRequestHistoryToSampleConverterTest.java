package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.model.entities.EstimationRequestHistory;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.mock;

public class EstimationRequestHistoryToSampleConverterTest {

    private final ConversionService conversionService = mock(ConversionService.class);
    private final EstimationRequestHistoryToSampleConverter converter = new EstimationRequestHistoryToSampleConverter(conversionService);

    @Test
    public void whenGetSourceThenReturnExpectedClass() {
        assertEquals(EstimationRequestHistory.class, converter.getSource());
    }
}