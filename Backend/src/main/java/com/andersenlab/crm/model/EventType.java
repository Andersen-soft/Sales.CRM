package com.andersenlab.crm.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum EventType {
    @JsonProperty("create")
    CREATE,
    @JsonProperty("update")
    UPDATE
}
