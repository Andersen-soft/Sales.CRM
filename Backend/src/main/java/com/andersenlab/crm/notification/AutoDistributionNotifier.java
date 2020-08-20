package com.andersenlab.crm.notification;

import com.andersenlab.crm.events.CompanySaleAssignedEmailEmployeeNotifierEvent;
import com.andersenlab.crm.events.CompanySaleEmployeeSetMailEvent;
import com.andersenlab.crm.model.Message;
import com.andersenlab.crm.model.RecipientDto;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.services.MailService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

import static com.andersenlab.crm.notification.ResumeRequestMailNotifier.COMPANY;
import static com.andersenlab.crm.notification.ResumeRequestMailNotifier.FIO;
import static com.andersenlab.crm.notification.ResumeRequestMailNotifier.URL_TEMPLATE;
import static com.andersenlab.crm.services.i18n.I18nConstants.LANGUAGE_TAG_EN;
import static com.andersenlab.crm.utils.EmailHelper.URL;

@Component
@RequiredArgsConstructor
public class AutoDistributionNotifier {
    
    private static final String VN_EMAIL = "vn@andersenlab.com";
    
    @Value("${app.url}")
    private String url;

    @Value("${skype.url.sales}")
    private String telegramSale;

    private final MailService mailService;

    @Transactional
    @Async
    @EventListener(CompanySaleEmployeeSetMailEvent.class)
    public void onCompanySaleEndMailNotifier(CompanySaleEmployeeSetMailEvent event) {
        RecipientDto recipientDto = RecipientDto.builder()
                .contact(event.getUserEmail())
                .build();
        RecipientDto vnRecipient = RecipientDto.builder().contact(VN_EMAIL).build();

        Map<String, Object> args = new HashMap<>();
        args.put(COMPANY, event.getCompanyName());
        args.put(URL, createUrl(event.getSaleId()));
        args.put(FIO, event.getUserName().trim());

        Message message = Message.builder()
                .subject("Auto assignment of leads")
                .args(args)
                .template(Message.Template.AUTO_DISTRIBUTION_SALE_SET_EN)
                .body("")
                .build();

        if ("ru".equals(event.getUserLocale())) {
            message.setSubject("Автораспределение лидов");
            message.setTemplate(Message.Template.AUTO_DISTRIBUTION_SALE_SET_RU);
        }

        mailService.sendMail(recipientDto, message);
        mailService.sendMail(vnRecipient, message);
    }

    @Transactional
    @EventListener(CompanySaleAssignedEmailEmployeeNotifierEvent.class)
    public void onEmailNotifyChangeLeadResponsible(CompanySaleAssignedEmailEmployeeNotifierEvent event) {
        Employee targetEmployee = event.getResponsibleTo();
        RecipientDto recipientDto = RecipientDto.builder()
                .contact(event.getUserEmail()).build();
        RecipientDto vnRecipient = RecipientDto.builder().contact(VN_EMAIL).build();

        final String SUBJECT_EN = "You've been assigned as Responsible for the sale";
        final String SUBJECT_RU = "Вас назначили ответственным за продажу";
        final String FIO = "fio";
        final String FIO_2 = "fio_2";
        final String COMPANY_NAME = "companyName";
        final String URL = "url";
        final String SALES_URL = "salesUrl";

        String subject;
        Message.Template template;

        if (LANGUAGE_TAG_EN.equalsIgnoreCase(targetEmployee.getEmployeeLang())) {
            template = event.isAutoChange() ? Message.Template.RESPONSIBLE_CHANGE_LEAD_AUTO_EN
                    : Message.Template.RESPONSIBLE_CHANGE_LEAD_MANUAL_EN;
            subject = SUBJECT_EN;
        } else {
            template = event.isAutoChange() ? Message.Template.RESPONSIBLE_CHANGE_LEAD_AUTO_RU
                    : Message.Template.RESPONSIBLE_CHANGE_LEAD_MANUAL_RU;
            subject = SUBJECT_RU;
        }

        Map<String, Object> args = new HashMap<>();
        args.put(FIO, event.getResponsibleTo().getFirstName() + " " +
                event.getResponsibleTo().getLastName());
        args.put(URL, url);
        args.put(SALES_URL, event.getSalesUrl());
        args.put(COMPANY_NAME, event.getCompanyName());
        if (!event.isAutoChange()) {
            args.put(FIO_2, event.getResponsibleFrom().getFirstName() + " " +
                    event.getResponsibleFrom().getLastName());
        }

        Message message = Message.builder()
                .template(template)
                .subject(subject)
                .args(args)
                .body("")
                .build();

        mailService.sendMail(recipientDto, message);
        mailService.sendMail(vnRecipient, message);
    }

    private String createUrl(Long id) {
        return String.format(URL_TEMPLATE, url, telegramSale, id);
    }
}