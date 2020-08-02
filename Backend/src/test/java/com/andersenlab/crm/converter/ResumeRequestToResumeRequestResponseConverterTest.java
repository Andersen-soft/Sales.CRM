package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.model.entities.ResumeRequest;
import com.andersenlab.crm.rest.response.ResumeRequestResponse;
import org.junit.Test;

import java.time.LocalDateTime;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.mock;

public class ResumeRequestToResumeRequestResponseConverterTest {

    private ResumeRequestToResumeRequestResponseConverter converter =
            new ResumeRequestToResumeRequestResponseConverter(mock(ConversionService.class));

    @Test
    public void whenConvertThenFieldsOfConvertedExpected() {
        ResumeRequest request = new ResumeRequest();
        request.setName("some name");
        request.setDeadline(LocalDateTime.now());
        request.setStartAt(LocalDateTime.now().minusHours(12));
        request.setIsActive(true);

        ResumeRequestResponse converted = converter.convert(request);

        assertEquals(request.getDeadline().toLocalDate(), converted.getDeadLine());
        assertEquals(request.getStartAt(), converted.getStartAt());
        assertEquals(request.getIsActive(), converted.getIsActive());
        assertEquals(request.getName(), converted.getName());
    }

    @Test
    public void whenGetClassesThenReturnExpected() {
        assertEquals(converter.getSource(), ResumeRequest.class);
        assertEquals(converter.getTarget(), ResumeRequestResponse.class);
    }
}
