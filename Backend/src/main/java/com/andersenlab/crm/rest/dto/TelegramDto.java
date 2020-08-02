package com.andersenlab.crm.rest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TelegramDto {
    Long orderId;
    String userName;
    String chatId;
}
