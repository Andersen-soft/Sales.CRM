package com.andersenlab.crm.rest.controllers;

import org.springframework.web.util.UriComponentsBuilder;

/**
 * @author v.pronkin on 03.08.2018
 */

public class ApiTestHelper {

	public static final String CRM_HOST = "localhost:8080";

	private ApiTestHelper(){
		// fix sonar rule : Add a private constructor to hide the implicit public one.      NEW      squid:S1118
	}

	public static UriComponentsBuilder getUriBuilder() {
		return UriComponentsBuilder.newInstance().scheme("http").host(CRM_HOST);
	}
}
