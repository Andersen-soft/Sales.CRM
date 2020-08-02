package com.andersenlab.crm.exceptions;

public class CrmFileUploadException extends CrmException {

    public CrmFileUploadException(String msg) {
        super(CrmFileUploadException.class.getSimpleName() + " " + msg);
    }
}
