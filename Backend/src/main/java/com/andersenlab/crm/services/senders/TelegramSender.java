package com.andersenlab.crm.services.senders;

import com.andersenlab.crm.rest.dto.TelegramDto;
import io.restassured.http.ContentType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import static io.restassured.RestAssured.given;


@Service
@Slf4j
@RequiredArgsConstructor
public class TelegramSender {

    @Value("${telegram.url.apiUrl}")
    private String apiUrl;

    @Value("${telegram.chatId}")
    private String chatId;

    @Async
    public void send(Long orderId) {

        TelegramDto telegramDto = new TelegramDto();
        telegramDto.setChatId(chatId);
        telegramDto.setOrderId(orderId);

        given()
                .relaxedHTTPSValidation()
                .contentType(ContentType.JSON)
                .body(telegramDto)
                .when()
                .post(apiUrl + "GiveSaleOrder")
                .then()
                .statusCode(200)
                .extract().response().asString();
    }
}

