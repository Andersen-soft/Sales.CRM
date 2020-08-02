package com.andersenlab.crm.converter;

import com.andersenlab.crm.model.entities.Activity;
import com.andersenlab.crm.rest.request.ActivityCreateRequest;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class ActivityCreateRequestToActivityConverterTest {

    private ActivityCreateRequestToActivityConverter converter;

    @Before
    public void setup() {
        converter = new ActivityCreateRequestToActivityConverter();
    }

    @Test
    public void whenGetClassesThenReturnExpected() {
        assertEquals(converter.getSource(), ActivityCreateRequest.class);
        assertEquals(converter.getTarget(), Activity.class);
    }
}