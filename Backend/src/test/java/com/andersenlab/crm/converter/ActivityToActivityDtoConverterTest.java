package com.andersenlab.crm.converter;

import com.andersenlab.crm.model.entities.Activity;
import com.andersenlab.crm.rest.sample.ActivitySample;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class ActivityToActivityDtoConverterTest {

    private ActivityToActivitySampleConverter converter;

    @Before
    public void setup() {
        converter = new ActivityToActivitySampleConverter();
    }

    @Test
    public void whenGetClassesThenReturnExpected() {
        assertEquals(converter.getSource(), Activity.class);
        assertEquals(converter.getTarget(), ActivitySample.class);
    }
}