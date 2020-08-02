package com.andersenlab.crm.utils;

import lombok.Getter;
import lombok.Setter;
import org.junit.Test;

import java.util.Objects;
import java.util.function.Function;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

public class ConverterHelperTest {

    @Test
    public void whenEnumThenGetEnumType() {
        Class<?> targetType = TestEnum.TEST.getClass();
        Class<?> expectedResult = TestEnum.TEST.getClass();

        Class<?> result = ConverterHelper.getEnumType(targetType);

        assertEquals(expectedResult, result);
    }

    @Test(expected = IllegalArgumentException.class)
    public void whenNotEnumThenGetEnumTypeThrowsException() {
        Class<?> targetType = String.class;

        ConverterHelper.getEnumType(targetType);
    }

    private enum TestEnum {
        TEST
    }

    @Test
    public void whenGetNullableAndNotNullResultNotNull() {
        TestNullable nullable = new TestNullable();
        nullable.setValue(1);
        Function<Integer, String> function = Objects::toString;
        String expectedResult = "1";

        String result = ConverterHelper.getNullable(nullable.getValue(), function);

        assertEquals(expectedResult, result);
    }

    @Test
    public void whenGetNullableAndNullThenReturnNull() {
        TestNullable nullable = new TestNullable();
        nullable.setValue(null);
        Function<Integer, String> function = Objects::toString;

        String result = ConverterHelper.getNullable(nullable.getValue(), function);

        assertNull(result);
    }

    @Getter
    @Setter
    private static class TestNullable {
        private Integer value;
    }
}