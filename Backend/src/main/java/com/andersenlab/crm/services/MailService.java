package com.andersenlab.crm.services;

import com.andersenlab.crm.model.Message;
import com.andersenlab.crm.model.RecipientDto;

import java.util.Collection;

public interface MailService {
    void sendMail(Collection<RecipientDto> to, Message message);
    void sendMail(RecipientDto to, Message message);
}
