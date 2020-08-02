package com.andersenlab.crm.exceptions;

public class CrmAuthException extends CrmException {

    public CrmAuthException(String msg) {
        super(CrmAuthException.class.getSimpleName() + " " + msg);
    }
}
