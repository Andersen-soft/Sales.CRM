package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.model.entities.EstimationRequest;
import com.andersenlab.crm.rest.response.EstimationRequestResponse;
import org.junit.Test;

import java.time.LocalDateTime;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.mock;

/**
 * @author  Yevhenii Pshenychnyi
 */
public class EstimationRequestToEstimationRequestResponseConverterTest {

    private EstimationRequestToEstimationRequestResponseConverter converter =
            new EstimationRequestToEstimationRequestResponseConverter(mock(ConversionService.class));

    @Test
    public void whenConvertThenFieldsOfConvertedExpected() {
        EstimationRequest request = new EstimationRequest();
        request.setName("description");
        request.setDeadline(LocalDateTime.now());
        request.setIsActive(true);
        request.setCreateDate(LocalDateTime.now());

        EstimationRequestResponse converted = converter.convert(request);

        assertEquals(request.getIsActive(), converted.getIsActive());
        assertEquals(request.getName(), converted.getName());
        assertEquals(request.getDeadline().toLocalDate(), converted.getDeadline());
    }

    @Test
    public void whenGetClassesThenReturnExpected() {
        assertEquals(converter.getSource(), EstimationRequest.class);
        assertEquals(converter.getTarget(), EstimationRequestResponse.class);
    }
}
