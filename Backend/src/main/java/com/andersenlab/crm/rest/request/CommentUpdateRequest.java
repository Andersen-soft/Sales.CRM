package com.andersenlab.crm.rest.request;

import com.andersenlab.crm.rest.deserializers.OptionalFieldDeserializer;
import com.andersenlab.crm.validation.NullOrNotBlank;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.Data;

@Data
public class CommentUpdateRequest {
    @NullOrNotBlank
    @JsonDeserialize(using = OptionalFieldDeserializer.class)
    private String description;
}
