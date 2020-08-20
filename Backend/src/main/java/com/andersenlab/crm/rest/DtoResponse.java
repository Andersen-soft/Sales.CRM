package com.andersenlab.crm.rest;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DtoResponse<T> {

    private Long id;
    private T detail;

}
