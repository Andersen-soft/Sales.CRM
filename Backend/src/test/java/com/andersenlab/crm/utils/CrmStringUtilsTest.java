package com.andersenlab.crm.utils;

import org.junit.Test;

import static com.andersenlab.crm.utils.CrmStringUtils.escapeDollarsAndSlashes;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

public class CrmStringUtilsTest {

    private static final String SOURCE_WITH_DOLLAR = "test$";
    private static final String SOURCE_WITHOUT_DOLLAR = "test";
    private static final String EXPECTED = "test\\$";

    @Test
    public void whenStringContainsSingOfDollarThenGetEscapeDollars() {
        String str = escapeDollarsAndSlashes(SOURCE_WITH_DOLLAR);

        assertEquals(EXPECTED, str);
    }

    @Test
    public void whenStringNotContainsSingOfDollarThenGetCurrentString() {
        String str = escapeDollarsAndSlashes(SOURCE_WITHOUT_DOLLAR);

        assertEquals(SOURCE_WITHOUT_DOLLAR, str);
    }

    @Test
    public void whenStringNullThenGetNull() {
        String str = escapeDollarsAndSlashes(null);

        assertNull(str);
    }
}