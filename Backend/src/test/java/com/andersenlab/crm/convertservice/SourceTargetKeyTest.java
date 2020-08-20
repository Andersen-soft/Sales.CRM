package com.andersenlab.crm.convertservice;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotEquals;

public class SourceTargetKeyTest {
    @Test
    public void whenHashCodeAndObjectsEqualThenReturnTrue() {
        SourceTargetKey sourceTargetKey1 = new SourceTargetKey(Integer.class, String.class);
        SourceTargetKey sourceTargetKey2 = new SourceTargetKey(Integer.class, String.class);

        assertEquals(sourceTargetKey1.hashCode(), sourceTargetKey2.hashCode());
    }

    @Test
    public void whenHashCodeAndObjectsNotEqualThenReturnFalse() {
        SourceTargetKey sourceTargetKey1 = new SourceTargetKey(Integer.class, String.class);
        SourceTargetKey sourceTargetKey2 = new SourceTargetKey(Integer.class, Integer.class);

        assertNotEquals(sourceTargetKey1.hashCode(), sourceTargetKey2.hashCode());
    }

    @Test
    public void whenEqualsAndObjectsEqualThenReturnTrue() {
        SourceTargetKey sourceTargetKey1 = new SourceTargetKey(Integer.class, String.class);
        SourceTargetKey sourceTargetKey2 = new SourceTargetKey(Integer.class, String.class);

        assertEquals(sourceTargetKey1, sourceTargetKey2);
    }

    @Test
    public void whenEqualsAndObjectsNotEqualThenReturnFalse() {
        SourceTargetKey sourceTargetKey1 = new SourceTargetKey(Integer.class, String.class);
        SourceTargetKey sourceTargetKey2 = new SourceTargetKey(Integer.class, Integer.class);

        assertNotEquals(sourceTargetKey1, sourceTargetKey2);
    }

    @Test
    public void whenGetSourceClassThenReturnExpected(){
        SourceTargetKey sourceTargetKey = new SourceTargetKey(Integer.class, String.class);
        assertEquals(sourceTargetKey.getSource(), Integer.class);
    }

    @Test
    public void whenGetTargetClassThenReturnExpected(){
        SourceTargetKey sourceTargetKey = new SourceTargetKey(Integer.class, String.class);
        assertEquals(sourceTargetKey.getTarget(), String.class);
    }
}