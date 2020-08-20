package com.andersenlab.crm.rest.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.experimental.Accessors;

@Data
@Accessors(chain = true)
public class SourceResponse {
    private Long id;
    private String name;
    private String type;

    @JsonProperty("tooltip")
    private String description;
}
