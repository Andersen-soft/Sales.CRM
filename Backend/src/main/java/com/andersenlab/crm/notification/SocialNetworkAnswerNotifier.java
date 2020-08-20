package com.andersenlab.crm.notification;

import com.andersenlab.crm.events.SocialNetworkAnswerCreateEvent;
import com.andersenlab.crm.model.Message;
import com.andersenlab.crm.model.RecipientDto;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.model.entities.SocialNetworkAnswer;
import com.andersenlab.crm.model.entities.SocialNetworkContact;
import com.andersenlab.crm.services.MailService;
import com.andersenlab.crm.services.SocialNetworkContactService;
import com.andersenlab.crm.utils.EmailHelper;
import com.google.common.collect.ImmutableMap;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.util.Optional;

import static com.andersenlab.crm.utils.EmailHelper.APP_URL;
import static com.andersenlab.crm.utils.EmailHelper.URL;
import static org.apache.commons.lang3.StringUtils.EMPTY;

@RequiredArgsConstructor
@Component
public class SocialNetworkAnswerNotifier {
    @Value("${app.url}")
    private String crmUrl;

    private final MailService mailService;
    private final SocialNetworkContactService socialNetworkContactService;

    private static final String URL_TEMPLATE = "%s%s";
    private static final String MESSAGE = "message";
    private static final String SUBJECT_RU = "Мои ответы соцсетей";
    private static final String SUBJECT_EN = "My social networks replies";

    @EventListener(SocialNetworkAnswerCreateEvent.class)
    public void onResumeCreate(final SocialNetworkAnswerCreateEvent event) {
        final SocialNetworkAnswer answer = event.getSocialNetworkAnswer();
        final SocialNetworkContact contact = socialNetworkContactService.getById(answer.getSocialNetworkContact().getId());
        Optional.of(contact.getSales())
                .filter(Employee::getIsActive)
                .ifPresent(employee -> {
                    final RecipientDto recipient = EmailHelper.mapEmployeeToRecipientDto(contact.getSales());
                    final ImmutableMap<String, Object> args = ImmutableMap.of(
                            APP_URL, String.format(URL_TEMPLATE, crmUrl, "/reports-social"),
                            URL, answer.getLinkLead(),
                            MESSAGE, answer.getMessage().split("\n")
                    );
                    buildAndSend(recipient, args, Message.Template.SOCIAL_NETWORK_ANSWER_CREATED);
                });
    }

    private void buildAndSend(
            final RecipientDto recipient,
            final ImmutableMap<String, Object> args,
            Message.Template messageTemplate
    ) {
        mailService.sendMail(recipient, Message.builder()
                .subject(SUBJECT_EN)
                .args(args)
                .template(messageTemplate)
                .body(EMPTY)
                .build());
    }
}
