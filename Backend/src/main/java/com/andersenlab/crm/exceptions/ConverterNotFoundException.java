package com.andersenlab.crm.exceptions;

/**
 * Thrown when conversion service can't find proper converter
 */
public class ConverterNotFoundException extends CrmException {

    /**
     * Constructs a new exception with the specified detail message.
     *
     * @param msg the detail message
     */
    public ConverterNotFoundException(String msg) {
        super("ConverterNotFoundException" + msg);
    }
}
