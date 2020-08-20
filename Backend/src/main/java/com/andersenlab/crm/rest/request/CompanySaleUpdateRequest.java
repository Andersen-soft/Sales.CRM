package com.andersenlab.crm.rest.request;

import com.andersenlab.crm.rest.deserializers.OptionalFieldDeserializer;
import com.andersenlab.crm.validation.NotZero;
import com.andersenlab.crm.validation.NullOrNotBlank;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.Data;

import javax.validation.constraints.Future;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import java.time.LocalDateTime;

@Data
public class CompanySaleUpdateRequest {

    private Long responsibleId;

    private Long mainContactId;

    private Long sourceId;

    private Long recommendationId;

    @JsonDeserialize(using = OptionalFieldDeserializer.class)
    private String description;

    @NullOrNotBlank
    private String status;

    @NullOrNotBlank
    private String category;

    private Long companyId;

    @Min(-1L)
    @Max(10L)
    @NotZero
    private Long weight;

    @Future
    private LocalDateTime nextActivityDate;
}
