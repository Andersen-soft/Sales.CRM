package com.andersenlab.crm.rest.response;

import com.andersenlab.crm.model.EventType;
import lombok.Data;

import java.util.Collection;

@Data
public class ExpressSaleResponse {

    private EventType type;
    private Collection<ExpressSaleDto> sales;
}
