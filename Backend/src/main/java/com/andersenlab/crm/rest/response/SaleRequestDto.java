package com.andersenlab.crm.rest.response;

import com.andersenlab.crm.model.entities.SaleRequestType;
import lombok.Getter;
import lombok.Setter;

/**
 * DTO for sales report. Column "Request Name". Returns the id, its name and type.
 */

@Getter
@Setter
public class SaleRequestDto {
    private final String id;
    private final String name;
    private String type;

    public SaleRequestDto(String[] source, SaleRequestType type) {
        this.id = source[0];
        this.name = source[1];
        this.type = type.getName();
    }
}
