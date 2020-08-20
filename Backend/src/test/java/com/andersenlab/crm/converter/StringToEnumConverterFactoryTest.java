package com.andersenlab.crm.converter;

import com.andersenlab.crm.model.Nameable;
import org.junit.Test;
import org.springframework.core.convert.converter.Converter;

import static org.junit.Assert.assertEquals;

public class StringToEnumConverterFactoryTest {

    private StringToEnumConverterFactory converterFactory = new StringToEnumConverterFactory();

    @Test
    public void testGetConverter() {

        Class<NameableEnum> nameableEnumClass = NameableEnum.class;
        Class<TestEnum> testEnumClass = TestEnum.class;

        Converter<String, NameableEnum> nameableEnumConverter = converterFactory.getConverter(nameableEnumClass);
        Converter<String, TestEnum> testEnumConverter = converterFactory.getConverter(testEnumClass);

        assertEquals(NameableEnum.INSTANCE, nameableEnumConverter.convert("name"));
        assertEquals(TestEnum.INSTANCE, testEnumConverter.convert("INSTANCE"));
    }

    private enum NameableEnum implements Nameable {
        INSTANCE("name");

        private final String name;

        NameableEnum(String name) {
            this.name = name;
        }

        @Override
        public String getName() {
            return name;
        }
    }

    private enum TestEnum {
        INSTANCE
    }
}