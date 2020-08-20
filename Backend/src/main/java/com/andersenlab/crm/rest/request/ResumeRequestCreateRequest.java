package com.andersenlab.crm.rest.request;

import com.andersenlab.crm.rest.deserializers.OptionalFieldDeserializer;
import com.andersenlab.crm.validation.NullOrNotBlank;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.Data;

import javax.validation.constraints.FutureOrPresent;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;

/**
 * Represents request for creating new resume request
 */
@Data
public class ResumeRequestCreateRequest {

    @NotNull
    private Long companyId;

    @NotBlank
    @JsonDeserialize(using = OptionalFieldDeserializer.class)
    private String name;

    @FutureOrPresent
    @NotNull
    private LocalDate deadline;

    @NotNull
    private String priority;

    @NullOrNotBlank
    @JsonDeserialize(using = OptionalFieldDeserializer.class)
    private String comment;

    @NotNull
    private Long companySale;
}
