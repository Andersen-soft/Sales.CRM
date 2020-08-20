package com.andersenlab.crm.utils;

import org.junit.Test;

import java.util.stream.Stream;

import static org.junit.Assert.assertEquals;

public class StreamUtilsTest {

    @Test
    public void testStreamOfArray() {
        Integer[] integers = new Integer[]{0, 1, 2};
        String[] strings = new String[]{};

        Stream<Integer> resultIntegers = StreamUtils.streamOf(integers);
        Stream<String> resultStrings = StreamUtils.streamOf(strings);

        assertEquals(3, resultIntegers.count());
        assertEquals(0, resultStrings.count());
    }

}