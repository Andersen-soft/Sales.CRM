package com.andersenlab.crm.services.impl;

import com.andersenlab.crm.model.Message;
import com.andersenlab.crm.model.RecipientDto;
import com.andersenlab.crm.services.MailService;
import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.StringWriter;
import java.util.Collection;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MailServiceImpl implements MailService {

    private final Configuration configuration;
    private final EmailSender sender;

    @Override
    public void sendMail(Collection<RecipientDto> to, Message message) {
        Set<String> emails = to.stream()
                .filter(dto -> Objects.nonNull(dto.getContact()))
                .map(RecipientDto::getContact)
                .collect(Collectors.toSet());
        try {
            String body = defineMessageBody(message);
            sender.sendMultiple(emails, message.getSubject(), body);
        } catch (TemplateException | IOException e) {
            log.error("Merging the template with the data-model failed.", e);
        }
    }

    @Override
    public void sendMail(RecipientDto to, Message message) {
        try {
            String body = defineMessageBody(message);
            sender.send(to.getContact(), message.getSubject(), body);
        } catch (TemplateException | IOException e) {
            log.error("Merging the template with the data-model failed.", e);
        }
    }

    private String defineMessageBody(Message message) throws TemplateException, IOException {
        if (message.getTemplate().equals(Message.Template.PLAIN_TEXT)) {
            return message.getBody();
        }
        Template template = getTemplate(message);
        StringWriter writer = getStringWriter(message, template);
        return writer.getBuffer().toString();
    }

    private StringWriter getStringWriter(Message message, Template template) throws TemplateException, IOException {
        StringWriter writer = new StringWriter();
        template.process(message.getArgs(), writer);
        return writer;
    }

    private Template getTemplate(Message message) throws IOException {
        try {
            return configuration.getTemplate(message.getTemplate().getName());
        } catch (IOException e) {
            log.error("Email template with name {} not found.", message.getTemplate().getName(), e);
            throw e;
        }
    }

}
