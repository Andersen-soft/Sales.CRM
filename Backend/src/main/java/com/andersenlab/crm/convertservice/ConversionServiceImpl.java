package com.andersenlab.crm.convertservice;

import org.hibernate.proxy.HibernateProxy;
import org.hibernate.proxy.LazyInitializer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.util.ClassUtils;

import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

/**
 * Implementation of ConversionService.
 *
 * @see ConversionService
 */
@Component
public class ConversionServiceImpl implements ConversionService {
    /**
     * Registry, containing registered converters.
     *
     * @see ConverterRegistry
     */
    private final ConverterRegistry converterRegistry;

    /**
     * Constructs instance of ConversionServiceImpl with specified instance of ConverterRegistry.
     *
     * @param converterRegistry object, that contains registered converters
     * @see ConverterRegistry
     */
    @Autowired
    public ConversionServiceImpl(ConverterRegistry converterRegistry) {
        this.converterRegistry = converterRegistry;
    }

    @Override
    public <S, T> T convert(final S source, final Class<T> target) {
        if (source == null) {
            return null;
        }
        final Class<S> sourceType = getClass(source);
        Converter<S, T> converter = converterRegistry.getConverter(sourceType, target);
        return converter.convert(source);
    }

    @Override
    public <S, T> T convertWithLocale(S source, Class<T> target, Locale locale) {
        if (source == null) {
            return null;
        }
        final Class<S> sourceType = getClass(source);
        Converter<S, T> converter = converterRegistry.getConverter(sourceType, target);
        return converter.convertWithLocale(source, locale);
    }

    /**
     * Returns the runtime class of the source object.
     *
     * @param source the object whose runtime class obtained.
     * @param <S>    the type of source object.
     * @return the runtime class of the source object
     */
    @SuppressWarnings("unchecked")
    private <S> Class<S> getClass(final S source) {
        if (!(source instanceof HibernateProxy)) {
            // in case we're looking for projection proxy
            Class<S> sourceClass = (Class<S>) source.getClass();
            Class<?>[] interfases = source.getClass().getInterfaces();
            for (Class<?> inter : interfases) {
                if (Arrays.stream(inter.getAnnotations())
                        .anyMatch(a -> a instanceof ConvertClass)) {
                    sourceClass = (Class<S>) ClassUtils.getUserClass(inter);
                }
            }
            return sourceClass;
        } else {
            // in case we have hibernate's lazy init proxy
            LazyInitializer lazyInitializer =
                    ((HibernateProxy) source).getHibernateLazyInitializer();
            return lazyInitializer.getPersistentClass();
        }
    }

    @SuppressWarnings("squid:S1168")
    @Override
    public <S, T> List<T> convertToList(Iterable<S> source, Class<T> target) {
        if (source == null) {
            return null;
        }
        return StreamSupport.stream(source.spliterator(), false)
                .map(s -> converterRegistry.getConverter(getClass(s), target).convert(s))
                .collect(Collectors.toList());
    }

    @Override
    public <S, T> List<T> convertToListWithLocale(Iterable<S> source, Class<T> target, Locale locale) {
        return StreamSupport.stream(source.spliterator(), false)
                .map(s -> converterRegistry.getConverter(getClass(s), target).convertWithLocale(s, locale))
                .collect(Collectors.toList());
    }

    @Override
    public <S, T> Page<T> convertToPage(Pageable pageable, Page<S> source, Class<T> target) {
        List<T> list = source.getContent().stream()
                .map(s -> converterRegistry.getConverter(getClass(s), target).convert(s))
                .collect(Collectors.toList());
        return new PageImpl<>(list, pageable, source.getTotalElements());
    }

    @Override
    public <S, T> Page<T> convertToPageWithLocale(Pageable pageable, Page<S> source, Class<T> target, Locale locale) {
        List<T> list = source.getContent().stream()
                .map(s -> converterRegistry.getConverter(getClass(s), target).convertWithLocale(s, locale))
                .collect(Collectors.toList());
        return new PageImpl<>(list, pageable, source.getTotalElements());
    }
}
