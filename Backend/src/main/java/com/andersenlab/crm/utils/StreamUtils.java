package com.andersenlab.crm.utils;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

public class StreamUtils<T> {

    private Optional<List<T>> value;

    private StreamUtils() {
        value = Optional.empty();
    }

    private StreamUtils(List<T> value) {
        this.value = Optional.ofNullable(value);
    }

    private StreamUtils(T[] array) {
        this.value = Optional.ofNullable(array)
                .map(Arrays::asList);
    }

    public StreamUtils<T> ofNullable(List<T> value) {
        return new StreamUtils<>(value);
    }

    private Stream<T> stream() {
        return value.map(List::stream).orElseGet(Stream::empty);
    }

    public static <T> Stream<T> streamOf(T[] array) {
        return new StreamUtils<>(array).stream();
    }

}
