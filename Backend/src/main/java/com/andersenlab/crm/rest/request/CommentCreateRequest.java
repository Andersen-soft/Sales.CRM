package com.andersenlab.crm.rest.request;

import com.andersenlab.crm.rest.deserializers.OptionalFieldDeserializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
public class CommentCreateRequest {
    @NotBlank
    @Size(min = 1, max = 600, message = "description must be between 1 and 600 characters")
    @JsonDeserialize(using = OptionalFieldDeserializer.class)
    private String description;
}
