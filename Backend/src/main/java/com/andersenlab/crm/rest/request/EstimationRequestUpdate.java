package com.andersenlab.crm.rest.request;

import com.andersenlab.crm.rest.deserializers.WhiteSpaceRemovalDeserializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.Data;

import java.time.LocalDate;

/**
 * @author Yevhenii Pshenychnyi
 */
@Data
public class EstimationRequestUpdate {
    @JsonDeserialize(using = WhiteSpaceRemovalDeserializer.class)
    private String name;
    private LocalDate deadLine;
    private Long responsibleId;
    private String status;
    private Long companyId;
    private Long companySaleId;
    private Long responsibleForRequestId;
}
