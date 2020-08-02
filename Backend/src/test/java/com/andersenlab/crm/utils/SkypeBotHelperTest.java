package com.andersenlab.crm.utils;

import org.junit.Test;

import java.time.LocalDateTime;

import static org.junit.Assert.assertEquals;

public class SkypeBotHelperTest {

    @Test
    public void getIdleHoursWhenDurationEqualsZero(){
        String idle = SkypeBotHelper.getIdleHoursString(LocalDateTime.now().plusMinutes(29));

        assertEquals("", idle);
    }
}
