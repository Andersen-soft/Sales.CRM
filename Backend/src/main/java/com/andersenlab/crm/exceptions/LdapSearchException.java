package com.andersenlab.crm.exceptions;

public class LdapSearchException extends CrmException {

    public LdapSearchException(String msg) {
        super(LdapSearchException.class.getSimpleName() + ": " + msg);
    }
}
