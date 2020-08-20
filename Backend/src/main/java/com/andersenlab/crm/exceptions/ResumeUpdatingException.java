package com.andersenlab.crm.exceptions;

public class ResumeUpdatingException extends CrmException {
    public ResumeUpdatingException(String msg) {
        super(ResumeUpdatingException.class.getSimpleName() + ": " + msg);
    }
}
