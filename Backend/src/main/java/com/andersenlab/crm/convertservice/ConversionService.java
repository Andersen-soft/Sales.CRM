package com.andersenlab.crm.convertservice;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Locale;

/**
 * A service interface for type conversion. This is the entry point into the convert system.
 * To perform a type conversion, call convert(S source, Class target).
 */
public interface ConversionService {
    /**
     * Converts the given source to the specified target.
     *
     * @param source the source object to convert
     * @param target the target type to convert to
     * @param <S>    the type of source object
     * @param <T>    the type of object, obtained as a result of conversion
     * @return the converted object
     */
    <S, T> T convert(S source, Class<T> target);

    <S, T> T convertWithLocale(S source, Class<T> target, Locale locale);

    /**
     * Converts a list of objects to a list of objects of type T.
     *
     * @param source the iterable of objects to convert
     * @param target the target type
     * @param <S>    the type of source objects
     * @param <T>    the type of objects, obtained as a result of conversion
     * @return the list of converted object
     */
    <S, T> List<T> convertToList(Iterable<S> source, Class<T> target);

    <S, T> List<T> convertToListWithLocale(Iterable<S> source, Class<T> target, Locale locale);

    <S, T> Page<T> convertToPage(Pageable pageable, Page<S> source, Class<T> target);

    <S, T> Page<T> convertToPageWithLocale(Pageable pageable, Page<S> source, Class<T> target, Locale locale);
}
