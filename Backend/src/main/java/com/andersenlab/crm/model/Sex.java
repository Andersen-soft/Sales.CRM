package com.andersenlab.crm.model;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum Sex implements Nameable {

    MALE("Мужской"),
    FEMALE("Женский");

    private final String name;

    public String getName() {
        return name;
    }
}
