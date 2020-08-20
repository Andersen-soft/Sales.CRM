package com.andersenlab.crm.exceptions;

/**
 * Base crm exception class
 */
public class OutsiderAccessException extends RuntimeException {

    public OutsiderAccessException(Exception e) {
        super(e);
    }

    public OutsiderAccessException(String msg) {
        super(msg);
    }

    public OutsiderAccessException(String format, Object... args) {
        super(String.format(format, args));
    }

    public OutsiderAccessException(String message, Exception e) {
        super(message, e);
    }
}
