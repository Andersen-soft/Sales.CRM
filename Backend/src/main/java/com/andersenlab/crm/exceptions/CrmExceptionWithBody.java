package com.andersenlab.crm.exceptions;

import com.andersenlab.crm.rest.dto.Dto;
import lombok.Getter;

public class CrmExceptionWithBody extends CrmException {

    @Getter
    private final Dto body;

    public CrmExceptionWithBody(String msg, Dto data) {
        super(msg);
        this.body = data;
    }
}
