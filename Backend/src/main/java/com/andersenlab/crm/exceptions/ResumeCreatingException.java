package com.andersenlab.crm.exceptions;

public class ResumeCreatingException extends CrmException {
    public ResumeCreatingException(String msg) {
        super(ResumeCreatingException.class.getSimpleName() + ": " + msg);
    }
}
