package com.andersenlab.crm.services;

import com.andersenlab.crm.rest.dto.TelegramDto;
import org.springframework.stereotype.Service;

@Service
public interface TelegramService {

    void send(TelegramDto telegramDto, String telegramController);

    TelegramDto createDto(long orderId, String username);

}
