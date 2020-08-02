package com.andersenlab.crm.convertservice;

import com.andersenlab.crm.exceptions.ConverterNotFoundException;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertSame;

public class ConverterRegistryTest {
    private ConverterRegistry converterRegistry;

    @Before
    public void setup() {
        converterRegistry = new ConverterRegistry();
    }

    @Test
    public void whenRegisterConverterThenRegistered() {
        TestConverter testConverter = new TestConverter();
        converterRegistry.register(testConverter);
        Converter<Integer, String> converter = converterRegistry.getConverter(Integer.class, String.class);
        assertSame(testConverter, converter);
    }

    @Test(expected = ConverterNotFoundException.class)
    public void whenConverterNotFoundExpectedConverterNotFound() {
        converterRegistry.getConverter(Integer.class, String.class);
    }
}