package com.andersenlab.crm.convertservice;

public class TestConverter implements Converter<Integer, String> {

    @Override
    public Class<Integer> getSource() {
        return Integer.class;
    }

    @Override
    public Class<String> getTarget() {
        return String.class;
    }

    @Override
    public String convert(Integer source) {
        return source.toString();
    }
}

