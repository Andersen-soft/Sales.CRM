package com.andersenlab.crm.converter;

import com.andersenlab.crm.model.Nameable;
import lombok.AllArgsConstructor;
import org.springframework.core.convert.converter.Converter;
import org.springframework.core.convert.converter.ConverterFactory;
import org.springframework.stereotype.Component;

import static com.andersenlab.crm.utils.ConverterHelper.getEnumType;
import static com.andersenlab.crm.utils.ServiceUtils.getByNameOrThrow;

@SuppressWarnings("unchecked")
@Component
public class StringToEnumConverterFactory implements ConverterFactory<String, Enum> {

    @Override
    public <T extends Enum> Converter<String, T> getConverter(Class<T> targetType) {
        if (Nameable.class.isAssignableFrom(targetType)) {
            return new StringToEnumWithName(getEnumType(targetType));
        }

        return new StringToEnumConverterFactory.StringToEnum(getEnumType(targetType));
    }

    @AllArgsConstructor
    private class StringToEnum<T extends Enum> implements Converter<String, Enum> {

        private final Class<T> enumType;

        @Override
        public Enum convert(String source) {
            return Enum.valueOf(enumType, source.trim().toUpperCase());
        }
    }

    @AllArgsConstructor
    private class StringToEnumWithName<T extends Enum<T> & Nameable> implements Converter<String, T> {

        private final Class<T> namedEnumType;

        @Override
        public T convert(String source) {
            return getByNameOrThrow(namedEnumType, source);
        }
    }
}
