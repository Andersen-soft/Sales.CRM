package com.andersenlab.crm.rest.request;

import com.andersenlab.crm.model.entities.Source;
import com.andersenlab.crm.rest.deserializers.OptionalFieldDeserializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class SourceUpdateRequest {

    @NotNull
    @JsonDeserialize(using = OptionalFieldDeserializer.class)
    private String name;

    @NotNull
    private Source.Type type;
}
