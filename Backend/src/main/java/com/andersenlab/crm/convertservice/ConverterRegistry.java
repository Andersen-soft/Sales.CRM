package com.andersenlab.crm.convertservice;

import com.andersenlab.crm.exceptions.ConverterNotFoundException;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

/**
 * Class, designed for storing and accessing the registered converters.
 * Converter - an object, that implements the Converter interface.
 *
 * @see Converter
 */
@Component
public class ConverterRegistry {
    /**
     * Map, which contains converters as value, and instance of SourceTargetKey class, as key.
     *
     * @see SourceTargetKey
     */
    private final Map<SourceTargetKey, Converter> converterMap = new HashMap<>();

    /**
     * registers the converter, by putting it to converterMap.
     * For storing the converter, generates instance of SourceTargetKey class, used as key
     *
     * @param converter the converter to register
     * @see SourceTargetKey
     */
    public void register(Converter converter) {
        SourceTargetKey sourceTargetKey = new SourceTargetKey(converter.getSource(), converter.getTarget());
        converterMap.put(sourceTargetKey, converter);
    }

    /**
     * Returns a registered converter.
     *
     * @param sourceClass the runtime class of converted objects
     * @param targetClass the runtime class of obtained as a result of conversion object
     * @param <S>         the type of source object
     * @param <T>         the type of obtained as a result of conversion object
     * @return the registered converter
     * @see Converter
     * @see SourceTargetKey
     */
    @SuppressWarnings("unchecked")
    <S, T> Converter<S, T> getConverter(final Class<S> sourceClass, final Class<T> targetClass) {
        SourceTargetKey sourceTargetKey = new SourceTargetKey(sourceClass, targetClass);
        return findConverterByKey(sourceTargetKey);
    }

    /**
     * Returns a registered converter from convertMap.
     *
     * @param sourceTargetKey the key whose associated converter is to be returned
     * @return the converter to which the specified key is mapped
     * @throws ConverterNotFoundException if the converter for specified key not found
     */
    private Converter findConverterByKey(SourceTargetKey sourceTargetKey) {
        Converter converter = converterMap.get(sourceTargetKey);
        if (converter == null) {
            throw new ConverterNotFoundException("Converter with target " +
                    sourceTargetKey.getTarget().getName() +
                    " and source " +
                    sourceTargetKey.getSource().getName() +
                    " not found");
        }
        return converter;
    }
}
