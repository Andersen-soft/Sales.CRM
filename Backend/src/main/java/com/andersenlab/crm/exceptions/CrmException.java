package com.andersenlab.crm.exceptions;

/**
 * Base crm exception class
 */
public class CrmException extends RuntimeException {

    public CrmException(Exception e) {
        super(e);
    }

    public CrmException(String msg) {
        super(msg);
    }

    public CrmException(String format, Object... args) {
        super(String.format(format, args));
    }

    public CrmException(String message, Exception e) {
        super(message, e);
    }
}
