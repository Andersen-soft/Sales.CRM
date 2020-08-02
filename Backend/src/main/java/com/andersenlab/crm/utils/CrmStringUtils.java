package com.andersenlab.crm.utils;

import javax.annotation.Nullable;
import java.util.Objects;
import java.util.Optional;
import java.util.regex.Matcher;

public class CrmStringUtils {

    private CrmStringUtils() {
    }

    @Nullable
    public static String escapeDollarsAndSlashes(String value) {
        return Objects.nonNull(value) ? Matcher.quoteReplacement(value) : value;
    }

    /**
     * Bugfix for database throwing 500 exception when passed strings has characters
     * with the size of > 2 bytes. (i.e. emojis)
     *
     * @param description Existing comment description.
     * @return Description with all the extra characters removed.
     */
    public static String fixStringDescription(String description) {
        String regex = "[^\\u0000-\\uFFFF]";

        return Optional.ofNullable(description)
                .map(d -> d.replaceAll(regex, ""))
                .orElse("");
    }
}
