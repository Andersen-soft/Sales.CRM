package com.andersenlab.crm.rest.controllers;

final class TestConstants {

    static final String DATA = "$.data";
    static final String ERROR_CODE = "$.errorCode";
    static final String SUCCESS = "$.success";
    static final String ERROR_MESSAGE = "$.errorMessage";
    static final String RESPONSE_CODE = "$.responseCode";
    static final String NOT_FOUND_EXCEPTION = "ResourceNotFoundException: Not Found";
    static final String NOT_FOUND_MESSAGE = "Not Found";
    static final String TEST_FIRST_NAME = "test";
    static final Long TEST_ID = 1L;
    static final String TEST_DESCRIPTION = "test";
    static final String BODY = "{}";
    static final String COMPANY_CREATE_URL = "/company/create_company";
    static final String CONTACT_CREATE_URL = "/contact/create_contact";
    static final String COMMENT_URL = "/comment";
    static final String TEST_LAST_NAME = "lastName";
    static final String TEST_EMAIL = "email";
    static final Long ID = 1L;
    static final String HISTORY_URL = "/history";
    static final String HISTORY_DESCRIPTION_JSON_PATH = "$.data[%d].description";

    private TestConstants() {
    }
}
