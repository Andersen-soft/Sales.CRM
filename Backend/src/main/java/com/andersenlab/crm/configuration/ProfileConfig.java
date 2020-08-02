package com.andersenlab.crm.configuration;

/**
 * @author v.pronkin on 02.08.2018
 */
public class ProfileConfig {

    public static final String API_TEST = "apiTest";
    public static final String DB_INIT = "dbInit";

    private ProfileConfig() {
        // fix sonar rule : Add a private constructor to hide the implicit public one.      NEW      squid:S1118
    }
}
