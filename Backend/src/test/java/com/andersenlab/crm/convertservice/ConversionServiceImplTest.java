package com.andersenlab.crm.convertservice;

import com.andersenlab.crm.exceptions.ConverterNotFoundException;
import org.junit.Before;
import org.junit.Test;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

public class ConversionServiceImplTest {
    private ConverterRegistry converterRegistry;
    private ConversionService conversionService;

    @Before
    public void setup() {
        converterRegistry = mock(ConverterRegistry.class);
        conversionService = new ConversionServiceImpl(converterRegistry);
    }

    @Test
    public void whenConvertThenCorrectTypeConversionExpected() {
        given(converterRegistry.getConverter(Integer.class, String.class)).willReturn(new TestConverter());

        String convert = conversionService.convert(1, String.class);
        assertEquals("1", convert);
    }

    @Test(expected = ConverterNotFoundException.class)
    public void whenConverterNotFoundThenExceptionConverterNotFoundExpected() {
        given(converterRegistry.getConverter(Integer.class, String.class))
                .willThrow(new ConverterNotFoundException("Not found"));

        conversionService.convert(1, String.class);
    }

    @Test
    public void whenConvertToListThenReturnListOfConvertedItems() {
        Integer[] ints = {0, 1, 2};
        ArrayList<Integer> integers = new ArrayList<>(Arrays.asList(ints));

        given(converterRegistry.getConverter(Integer.class, String.class)).willReturn(new TestConverter());

        List<String> stringsFromList = conversionService.convertToList(integers, String.class);
        List<String> stringsFromIterable = conversionService.convertToList((Iterable<Integer>) integers, String.class);

        for (int i = 0; i < 3; i++) {
            assertEquals(String.valueOf(i), stringsFromList.get(i));
            assertEquals(String.valueOf(i), stringsFromIterable.get(i));
        }
    }

    @Test(expected = ConverterNotFoundException.class)
    public void whenConverterToListAndConverterNotFoundThenExceptionConverterNotFoundExpected() {
        ArrayList<Integer> integers = new ArrayList<>();
        integers.add(1);
        given(converterRegistry.getConverter(Integer.class, String.class))
                .willThrow(new ConverterNotFoundException("Not found"));

        conversionService.convertToList(integers, String.class);
    }
}
