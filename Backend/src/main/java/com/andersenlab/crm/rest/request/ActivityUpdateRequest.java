package com.andersenlab.crm.rest.request;

import com.andersenlab.crm.rest.deserializers.OptionalFieldDeserializer;
import com.andersenlab.crm.validation.CheckCreateDateTime;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ActivityUpdateRequest {

    @NotBlank
    @JsonDeserialize(using = OptionalFieldDeserializer.class)
    private String description;

    @NotEmpty
    private List<Long> contacts;

    @NotEmpty
    private List<String> types;

    @NotNull
    @CheckCreateDateTime
    private LocalDateTime dateActivity;
}
