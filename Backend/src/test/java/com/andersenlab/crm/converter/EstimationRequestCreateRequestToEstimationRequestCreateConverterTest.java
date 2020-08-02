package com.andersenlab.crm.converter;

import com.andersenlab.crm.model.entities.EstimationRequest;
import com.andersenlab.crm.rest.request.EstimationRequestCreate;
import org.junit.Test;

import java.time.LocalDate;

import static org.junit.Assert.assertEquals;

/**
 * @author  Yevhenii Pshenychnyi
 */
public class EstimationRequestCreateRequestToEstimationRequestCreateConverterTest {

    private EstimationRequestCreateToEstimationRequestConverter converter =
            new EstimationRequestCreateToEstimationRequestConverter();

    @Test
    public void whenConvertThenFieldsOfConvertedExpected() {
        EstimationRequestCreate request = new EstimationRequestCreate();
        request.setName("description");
        request.setDeadline(LocalDate.now());

        EstimationRequest converted = converter.convert(request);

        assertEquals(request.getName(), converted.getName());
        assertEquals(request.getDeadline(), converted.getDeadline().toLocalDate());
    }

    @Test
    public void whenGetClassesThenReturnExpected() {
        assertEquals(converter.getSource(), EstimationRequestCreate.class);
        assertEquals(converter.getTarget(), EstimationRequest.class);
    }
}
