package com.andersenlab.crm.rest.controllers;

import com.andersenlab.crm.configuration.ProfileConfig;
import com.andersenlab.crm.rest.request.LoginRequest;
import org.springframework.context.annotation.Profile;

import static com.andersenlab.crm.rest.controllers.ApiTestHelper.getUriBuilder;
import static io.restassured.RestAssured.given;
/**
 * @author v.pronkin on 02.08.2018
 */
@Profile(ProfileConfig.API_TEST)
public class LdapControllerApiTest {

	//	@Test   // will be enabled after creation integration script test
	public void login() {

		LoginRequest loginRequest = new LoginRequest();
		loginRequest.setUsername("v.pronkin");
		loginRequest.setPassword("***");
		loginRequest.setSubmit("");

		given().when().log().all()
				.body(loginRequest)
				.post(getUriBuilder().path("/login").build().toUriString())
				.then().log().all()
				.statusCode(200);
	}
}
