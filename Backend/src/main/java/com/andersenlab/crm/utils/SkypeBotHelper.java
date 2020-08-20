package com.andersenlab.crm.utils;

import com.andersenlab.crm.model.entities.PrivateData;
import lombok.extern.slf4j.Slf4j;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.function.Function;

@Slf4j
public class SkypeBotHelper {
    private static final String EMPTY = "";
    private static final String EXTRACT_RESULT_SET_ERROR_MESSAGE = "Extracting result set error: ";

    private SkypeBotHelper() {
    }

    public static <T> String getNullable(T t, Function<T, String> function) {
        return t == null ? EMPTY : " - ".concat(function.apply(t));
    }

    public static String ifEmptyOr(final String t) {
        return t.isEmpty() ? EMPTY : " - ".concat(t);
    }

    public static String getNullableFullName(PrivateData privateData) {
        if (privateData == null) {
            return EMPTY;
        }
        StringBuilder builder = new StringBuilder();
        if (privateData.getFirstName() != null) {
            builder.append(privateData.getFirstName()).append(" ");
        }
        if (privateData.getLastName() != null) {
            builder.append(privateData.getLastName());
        }
        return builder.toString().trim();
    }

    public static String getIdleHoursString(LocalDateTime changeDate) {
        String idle = EMPTY;
        if (changeDate != null) {
            Duration duration = Duration.between(changeDate, LocalDateTime.now());
            if (duration.toMinutes() % 60 > 29) {
                duration = duration.plusHours(1);
            } else if (Math.abs(duration.toHours()) < 1 && Math.abs(duration.toMinutes()) % 60 <= 29) {
                return idle;
            }
            idle = String.format(" - Простой %d ч (yawn)", Math.abs(duration.toHours()));
        }
        return idle;
    }

    public static String getString(ResultSet rs, String column) {
        try {
            return rs.getString(column);
        } catch (SQLException e) {
            log.error(EXTRACT_RESULT_SET_ERROR_MESSAGE, e);
            return EMPTY;
        }
    }

    public static Long getLong(ResultSet rs, String column) {
        try {
            return rs.getLong(column);
        } catch (SQLException e) {
            log.error(EXTRACT_RESULT_SET_ERROR_MESSAGE, e);
            return 0L;
        }
    }

    public static Timestamp getDateTime(ResultSet rs, String column) {
        try {
            return rs.getTimestamp(column);
        } catch (SQLException e) {
            log.error(EXTRACT_RESULT_SET_ERROR_MESSAGE, e);
            return null;
        }
    }
}
