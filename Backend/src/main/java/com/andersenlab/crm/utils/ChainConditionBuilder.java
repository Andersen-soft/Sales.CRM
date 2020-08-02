package com.andersenlab.crm.utils;

import java.util.function.Consumer;

public class ChainConditionBuilder<T> {

    public final T value;

    private ChainConditionBuilder(T value) {
        this.value = value;
    }

    public static <T> ChainConditionBuilder<T> setIntialValue(T value) {
        return new ChainConditionBuilder<>(value);
    }

    public ChainConditionBuilder<T> processCondition(Boolean condition, T value) {
        return Boolean.TRUE.equals(condition) ? new ChainConditionBuilder<>(value) : this;
    }

    public void finalAction(Consumer<T> statusSetter) {
        statusSetter.accept(value);
    }
}
