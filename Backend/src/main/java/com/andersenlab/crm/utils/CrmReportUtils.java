package com.andersenlab.crm.utils;

import com.andersenlab.crm.model.entities.SaleRequestType;
import com.andersenlab.crm.rest.response.SaleRequestDto;
import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableMap;
import org.springframework.util.ReflectionUtils;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.lang.reflect.Field;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static com.andersenlab.crm.services.i18n.I18nConstants.LANGUAGE_TAG_EN;
import static com.andersenlab.crm.services.i18n.I18nConstants.LANGUAGE_TAG_RU;
import static org.apache.commons.lang3.StringUtils.EMPTY;
import static org.apache.commons.lang3.StringUtils.SPACE;


public final class CrmReportUtils {

    private static final String DELIMITER = ";";
    private static final String DELIMITER_FOR_SALE_REPORT = "#=#";
    private static final String TEMPLATE = "Отсутствует";
    private static final String SEPARATOR = ", ";
    public static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm");
    public static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd.MM.yyyy");

    public static final String RU_HYPERLINK_TEMPLATE = "=ГИПЕРССЫЛКА(\"%s\";\"%s\")";
    public static final String EN_HYPERLINK_TEMPLATE = "=HYPERLINK(\"%s\";\"%s\")";

    public static final Map<String, String> LOCALE_TO_HYPERLINK_TEMPLATE_MAP = ImmutableMap.of(
            LANGUAGE_TAG_RU, RU_HYPERLINK_TEMPLATE,
            LANGUAGE_TAG_EN, EN_HYPERLINK_TEMPLATE
    );

    private CrmReportUtils() {
    }

    public static Map<Integer, List<String>> getSalesByStatus(String resultSet) {
        return Objects.isNull(resultSet) || resultSet.isEmpty() ? new HashMap<>() :
                Arrays.stream(resultSet.split(DELIMITER))
                        .map(tmp -> Arrays.asList(tmp.split(SPACE)))
                        .collect(Collectors.toMap(
                                list -> Integer.valueOf(list.get(1)),
                                list -> ImmutableList.of(list.get(0)),
                                (oldValue, newValue) ->
                                        Stream.concat(oldValue.stream(), newValue.stream()).collect(Collectors.toList())
                        ));
    }

    public static String concatSales(List<String> ids) {
        return Objects.isNull(ids) ? EMPTY : String.join(SEPARATOR, ids);
    }

    public static String replaceTemplateField(String field) {
        return !field.contains(TEMPLATE) ? field : EMPTY;
    }

    public static String replaceNullField(String field) {
        return Objects.nonNull(field) ? field : EMPTY;
    }

    public static String replaceNullField(Long field) {
        return Objects.nonNull(field) ? String.valueOf(field) : EMPTY;
    }
    
    public static void replaceAllStringNullFields(Object object) {
        Field[] fields = object.getClass().getDeclaredFields();
        for (Field field : fields) {
            if (field.getType() == String.class) {
                field.setAccessible(true);
                if (ReflectionUtils.getField(field, object) == null) {
                    ReflectionUtils.setField(field, object, EMPTY);
                }
            }
        }
    }

    /**
     * Parsing the string with requests for resume and estimation by id, name and type.
     *
     * @param requests Query string is taken from the database
     * @param type     Request type resume or estimation
     * @return List of requests for sale
     */
    public static List<SaleRequestDto> parseRequests(String requests, SaleRequestType type) {
        return Objects.isNull(requests) || requests.isEmpty() ? new ArrayList<>() :
                Arrays.stream(requests.split(DELIMITER_FOR_SALE_REPORT))
                        .map(request -> new SaleRequestDto(request.split(SPACE, 2), type))
                        .collect(Collectors.toList());
    }

    public static String composeUrlFromIdAndPath(String id, String path) {

        return ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path(path)
                .buildAndExpand(id)
                .toUriString();
    }

    public static String composeHyperlinkForLocale(String id, String path, Locale locale) {
        return composeHyperlinkForLocale(null, id, path, locale);
    }
    
    public static String composeHyperlinkForLocale(String text, String id, String path, Locale locale) {
        String template = LOCALE_TO_HYPERLINK_TEMPLATE_MAP.getOrDefault(locale.getLanguage(), RU_HYPERLINK_TEMPLATE);
        return String.format(
                template,
                composeUrlFromIdAndPath(id, path), text != null ? text : id
        );
    }
}
