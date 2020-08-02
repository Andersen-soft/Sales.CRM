package com.andersenlab.crm.converter;

import com.andersenlab.crm.model.entities.Activity;
import com.andersenlab.crm.rest.response.ActivityResponse;
import com.andersenlab.crm.services.i18n.I18nService;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.mock;

public class ActivityToActivityResponseConverterTest {

    private ActivityToActivityResponseConverter converter;
    private I18nService i18n = mock(I18nService.class);

    @Before
    public void setUp() {
        converter = new ActivityToActivityResponseConverter(i18n);
    }

    @Test
    public void whenGetClassesThenReturnExpected() {
        assertEquals(converter.getSource(), Activity.class);
        assertEquals(converter.getTarget(), ActivityResponse.class);
    }
}