package com.andersenlab.crm.services.impl;

import com.andersenlab.crm.configuration.properties.TelegramProperties;
import com.andersenlab.crm.rest.dto.TelegramDto;
import com.andersenlab.crm.services.TelegramService;
import io.restassured.http.ContentType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import static io.restassured.RestAssured.given;

@Service
@Slf4j
@RequiredArgsConstructor
public class TelegramServiceImpl implements TelegramService {
    private final TelegramProperties telegramProperties;

    @Override
    @Async
    public void send(TelegramDto telegramDto, String telegramController) {
        given()
                .relaxedHTTPSValidation()
                .contentType(ContentType.JSON)
                .body(telegramDto)
                .log().body()
                .when()
                .post(telegramProperties.getUrl().getApiUrl() + telegramController)
                .then()
                .log().body()
                .statusCode(200)
                .extract().response().asString();
    }

    @Override
    public TelegramDto createDto(long orderId, String username) {
        TelegramDto telegramDto = new TelegramDto();
        telegramDto.setChatId(telegramProperties.getChatId());
        telegramDto.setOrderId(orderId);
        telegramDto.setUserName(username);
        return telegramDto;
    }
}
