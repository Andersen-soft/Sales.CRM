package com.andersenlab.crm.utils;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class CrmLocalDateUtils {

    private CrmLocalDateUtils() {

    }

    public static LocalDate convertStringToLocalDate (String s) {
        LocalDate date = null;
        if (s != null && ! "".equals(s)) {
            date = LocalDate.parse(s, DateTimeFormatter.ISO_LOCAL_DATE);

        }
        return date;
    }
}
