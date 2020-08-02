package com.andersenlab.crm.converter;

import com.andersenlab.crm.model.entities.ResumeRequest;
import com.andersenlab.crm.rest.request.ResumeRequestCreateRequest;
import org.junit.Test;

import java.time.LocalDate;

import static org.junit.Assert.assertEquals;

public class ResumeRequestCreateRequestToResumeRequestConverterTest {

    private ResumeRequestCreateRequestToResumeRequestConverter converter = new ResumeRequestCreateRequestToResumeRequestConverter();

    @Test
    public void whenConvertThenFieldsOfConvertedExpected() {
        ResumeRequestCreateRequest request = new ResumeRequestCreateRequest();
        request.setName("some name");
        request.setDeadline(LocalDate.now());
        request.setPriority("major");

        ResumeRequest converted = converter.convert(request);

        assertEquals(request.getDeadline(), converted.getDeadline().toLocalDate());
        assertEquals(request.getName(), converted.getName());
    }

    @Test
    public void whenGetClassesThenReturnExpected() {
        assertEquals(converter.getSource(), ResumeRequestCreateRequest.class);
        assertEquals(converter.getTarget(), ResumeRequest.class);
    }
}
