package com.andersenlab.crm.services.impl;

import com.andersenlab.crm.services.BroadcastSender;
import com.andersenlab.crm.services.SingleSender;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.util.Set;

@Service
@Slf4j
@Qualifier("emailSender")
@RequiredArgsConstructor
public class EmailSender implements BroadcastSender, SingleSender {

    @Value("${spring.mail.username}")
    private String mailFrom;

    private final JavaMailSender mailSender;
    @Autowired
    @Lazy
    private EmailSender sender;

    @Override
    @Async
    public void sendMultiple(Set<String> emailList, String subject, String body) {
        log.info("Messaging started");
        emailList.forEach(email -> sender.send(email, subject, body));
    }

    @Override
    @Async
    public void send(String to, String subject, String body) {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);
        log.info("Creating email for recipient: {}", to);
        try {
            helper.setFrom(mailFrom);
            helper.setTo(to);
            helper.setSubject(subject);
            message.setContent(body, "text/html; charset=utf-8");
            mailSender.send(message);
        } catch (MessagingException e) {
            log.error("Error in creating email for recipient: {} with subject: {} body: {}", to, subject, body, e);
        } catch (MailException mailException) {
            log.error("Error in sending email for recipient: {} with subject: {} body: {}", to, subject, body, mailException);
        }

        log.info("Message sent.");
    }
}

