package com.andersenlab.crm.rest.request;

import com.andersenlab.crm.rest.deserializers.OptionalFieldDeserializer;
import com.andersenlab.crm.validation.CheckCreateDateTime;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.Data;
import lombok.experimental.Accessors;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Accessors(chain = true)
public class ActivityCreateRequest {

    @NotNull
    private Long companySaleId;

    @NotEmpty
    private List<String> types;

    @NotEmpty
    private List<Long> contacts;

    @NotNull
    @CheckCreateDateTime
    private LocalDateTime dateActivity;

    @NotBlank
    @JsonDeserialize(using = OptionalFieldDeserializer.class)
    private String description;
}
