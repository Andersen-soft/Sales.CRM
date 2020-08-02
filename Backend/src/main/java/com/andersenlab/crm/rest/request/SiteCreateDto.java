package com.andersenlab.crm.rest.request;


import com.andersenlab.crm.rest.deserializers.WhiteSpaceRemovalDeserializer;
import com.andersenlab.crm.validation.NullOrNotBlank;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel(description = "Импорт заказа с сайта Andersen и конвертация в продажу")
public class SiteCreateDto {

    @ApiModelProperty(value = "Имя заказчика")
    @NullOrNotBlank
    @JsonDeserialize(using = WhiteSpaceRemovalDeserializer.class)
    String name;

    @ApiModelProperty(value = "Email заказчика")
    @NullOrNotBlank
    @JsonDeserialize(using = WhiteSpaceRemovalDeserializer.class)
    String email;

    @ApiModelProperty(value = "Телефон заказчика")
    @NullOrNotBlank
    @JsonDeserialize(using = WhiteSpaceRemovalDeserializer.class)
    String phone;

    @ApiModelProperty(value = "Сообщение от заказчика")
    @NullOrNotBlank
    @JsonDeserialize(using = WhiteSpaceRemovalDeserializer.class)
    String message;

    @ApiModelProperty(value = "Форма подтверждения обратной связи")
    String notifyTo;

    @ApiModelProperty(value = "IP заказчика")
    String ip;

    @ApiModelProperty(value = "Дата создания записи")
    String date;

    @ApiModelProperty(value = "Форма обратной связи которую сайт " +
            "отправляет Заказчику с HTML комментариями")
    String content;

    @ApiModelProperty(value = "Текст ошибки, если при записи " +
            "или обработки данных возникли ошибки")
    String error;

    @ApiModelProperty(value = "ID формы на сайте для заполнения заказчиком")
    String form;

    @JsonProperty(value = "gclid")
    String googleClickId;

    @JsonProperty(value = "first_point")
    String siteFirstPoint;

    @JsonProperty(value = "last_point")
    String siteLastPoint;

    @JsonProperty(value = "session_point")
    String siteSessionPoint;
}
