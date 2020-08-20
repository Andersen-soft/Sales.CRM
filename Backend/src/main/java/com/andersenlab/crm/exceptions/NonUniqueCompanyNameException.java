package com.andersenlab.crm.exceptions;

public class NonUniqueCompanyNameException extends CrmException {
    public NonUniqueCompanyNameException(String msg) {
        super(msg);
    }
}
