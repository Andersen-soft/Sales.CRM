package com.andersenlab.crm.utils;

import com.andersenlab.crm.model.entities.CompanySale;
import org.apache.commons.lang3.StringUtils;

import java.util.List;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * @author Yevhenii Muzyka on 07.08.2018
 */
public class ConverterHelper {

    private ConverterHelper() {

    }

    public static <T, R> R getNullable(T t, Function<T, R> function) {
        return t == null ? null : function.apply(t);
    }

    public static <T> String getEmptyIfNull(T t, Function<T, String> function) {
        return t == null ? StringUtils.EMPTY : function.apply(t);
    }

    public static <T, R> R getNullableList(List<T> t, Function<List<T>, R> function) {
        return t != null && !t.isEmpty() ? function.apply(t) : null;
    }

    public static Class<?> getEnumType(Class<?> targetType) {
        Class<?> enumType = targetType;
        while (enumType != null && !enumType.isEnum()) {
            enumType = enumType.getSuperclass();
        }
        if (enumType == null) {
            throw new IllegalArgumentException("The target type does not refer to an enum");
        }
        return enumType;
    }

    public static Set<Long> getLinkedSales(List<CompanySale> sales) {
        return sales.stream()
                .filter(CompanySale::getIsActive)
                .map(CompanySale::getId)
                .collect(Collectors.toSet());
    }

    public static String getNullableFullName(String firstName, String lastName) {
        StringBuilder builder = new StringBuilder();
        if (firstName != null) {
            builder.append(firstName).append(" ");
        }
        if (lastName != null) {
            builder.append(lastName);
        }
        return builder.toString().trim();
    }
}
