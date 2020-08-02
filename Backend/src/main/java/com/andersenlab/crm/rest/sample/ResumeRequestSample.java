package com.andersenlab.crm.rest.sample;

import lombok.Data;

import java.util.Objects;

@Data
public class ResumeRequestSample {
    private Long id;
    private String name;
    private Long oldId;

    @Override
    public String toString(){
        return String.format("%s - %s", Objects.toString(id, ""), Objects.toString(name, "")).trim();
    }
}
