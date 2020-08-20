package com.andersenlab.crm.rest.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ActivityTypeResponse {
    private int ordinal;
    private String type;
    private String typeEnumCode;
}
