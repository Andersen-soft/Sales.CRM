package com.andersenlab.crm.rest.request;

import com.andersenlab.crm.rest.deserializers.WhiteSpaceRemovalDeserializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.Data;

import javax.validation.constraints.FutureOrPresent;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;

@Data
public class EstimationRequestCreate {
    @NotNull
    private Long companyId;
    @NotNull
    @JsonDeserialize(using = WhiteSpaceRemovalDeserializer.class)
    private String name;
    @FutureOrPresent
    @NotNull
    private LocalDate deadline;
    @JsonDeserialize(using = WhiteSpaceRemovalDeserializer.class)
    private String comment;
    @NotNull
    private Long companySale;
}
