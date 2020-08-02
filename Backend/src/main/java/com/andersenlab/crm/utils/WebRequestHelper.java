package com.andersenlab.crm.utils;

import org.apache.commons.lang3.StringUtils;
import org.springframework.web.context.request.NativeWebRequest;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Содержит статические методы для извлечение параметров GET запросов.
 */
public final class WebRequestHelper {

    private WebRequestHelper() {
    }

    public static Long extractLongParameter(NativeWebRequest webRequest, String parameter) {
        String value = webRequest.getParameter(parameter);
        return StringUtils.isNotBlank(value) ? Long.valueOf(value) : null;
    }

    public static List<Long> extractLongParameterList(NativeWebRequest webRequest, String parameter) {
        return extractMappedParameterList(webRequest, parameter, Long::valueOf);
    }

    public static String extractStringParameter(NativeWebRequest webRequest, String parameter) {
        String value = webRequest.getParameter(parameter);
        return StringUtils.isNotBlank(value) ? value : null;
    }

    public static List<String> extractStringParameterList(NativeWebRequest webRequest, String parameter) {
        return extractMappedParameterList(webRequest, parameter, String::valueOf);
    }

    public static Boolean extractBooleanParameter(NativeWebRequest webRequest, String parameter) {
        String value = webRequest.getParameter(parameter);
        return StringUtils.isNotBlank(value) ? Boolean.valueOf(value) : null;
    }

    public static <R> List<R> extractMappedParameterList(NativeWebRequest webRequest, String parameter,
                                                         Function<String, R> mapper) {
        String[] values = webRequest.getParameterValues(parameter);
        if (values != null) {
            return Arrays.stream(values)
                    .filter(StringUtils::isNotBlank)
                    .map(mapper)
                    .collect(Collectors.toList());
        }

        return new ArrayList<>();
    }
}
