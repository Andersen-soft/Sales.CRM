package com.andersenlab.crm.notification;

import com.andersenlab.crm.configuration.properties.ApplicationProperties;
import com.andersenlab.crm.events.CompanySaleArchivedEvent;
import com.andersenlab.crm.events.MailExpressSaleCreatedEvent;
import com.andersenlab.crm.events.MailImportSaleActivityCreatedEvent;
import com.andersenlab.crm.model.Message;
import com.andersenlab.crm.model.RecipientDto;
import com.andersenlab.crm.model.entities.CompanySale;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.services.EmployeeService;
import com.andersenlab.crm.services.MailService;
import com.andersenlab.crm.utils.EmailHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.andersenlab.crm.model.Message.Template.COMPANY_SALE_ARCHIVED_EN;
import static com.andersenlab.crm.model.Message.Template.COMPANY_SALE_ARCHIVED_RU;
import static com.andersenlab.crm.model.Message.Template.IMPORT_SALE_ACTIVITY_CREATED_EN;
import static com.andersenlab.crm.model.Message.Template.IMPORT_SALE_ACTIVITY_CREATED_RU;
import static com.andersenlab.crm.model.Message.Template.MAIL_EXPRESS_SALE_CREATED_EN;
import static com.andersenlab.crm.model.Message.Template.MAIL_EXPRESS_SALE_CREATED_RU;
import static com.andersenlab.crm.model.RoleEnum.ROLE_SALES_HEAD;
import static com.andersenlab.crm.services.i18n.I18nConstants.LANGUAGE_TAG_EN;
import static com.andersenlab.crm.utils.CrmConstants.VN_LOGIN;

@Component
@RequiredArgsConstructor
public class CompanySaleMailNotifier {
    private static final String KEY_FIO = "fio";
    private static final String KEY_FIO_ARCHIVED = "fioArchived";
    private static final String KEY_SALE = "company";
    private static final String KEY_URL = "url";
    private static final String EMPLOYEE_NAME_TEMPLATE = "%s %s";
    private static final String SALE_URL_TEMPLATE = "%s/sales/%d";

    private static final String SUBJECT_ON_SALE_ARCHIVED_EN = "Archiving the sale";
    private static final String SUBJECT_ON_SALE_ARCHIVED_RU = "Архивация продажи";

    private static final String SUBJECT_ON_MAIL_EXPRESS_SALE_CREATED_EN = "You've been assigned as Responsible for the sale";
    private static final String SUBJECT_ON_MAIL_EXPRESS_SALE_CREATED_RU = "Вас назначили ответственным за продажу";

    private static final String SUBJECT_UNABLE_TO_ASSIGN_AS_RESPONSIBLE_EN = "You can't be assigned as Responsible";
    private static final String SUBJECT_UNABLE_TO_ASSIGN_AS_RESPONSIBLE_RU = "Вы не можете стать Ответственным";

    private final MailService mailService;
    private final EmployeeService employeeService;

    private final ApplicationProperties applicationProperties;

    @EventListener(CompanySaleArchivedEvent.class)
    public void onCompanySaleArchived(CompanySaleArchivedEvent event) {
        String crmUrl = applicationProperties.getUrl();

        CompanySale sale = event.getCompanySale();
        List<Employee> recipients = employeeService.getEmployeesByRole(ROLE_SALES_HEAD);
        recipients.remove(event.getWhoArchived());

        for (Employee targetEmployee : recipients) {
            Map<String, Object> modelMap = new HashMap<>();
            modelMap.put(KEY_FIO, String.format(EMPLOYEE_NAME_TEMPLATE,
                    targetEmployee.getFirstName(), targetEmployee.getLastName()));
            modelMap.put(KEY_FIO_ARCHIVED, String.format(EMPLOYEE_NAME_TEMPLATE,
                    event.getWhoArchived().getFirstName(), event.getWhoArchived().getLastName()));
            modelMap.put(KEY_URL, String.format(SALE_URL_TEMPLATE,
                    crmUrl, sale.getId()));
            modelMap.put(KEY_SALE, sale.getCompany().getName());

            String subject;
            Message.Template template;
            if (LANGUAGE_TAG_EN.equalsIgnoreCase(targetEmployee.getEmployeeLang())) {
                subject = SUBJECT_ON_SALE_ARCHIVED_EN;
                template = COMPANY_SALE_ARCHIVED_EN;
            } else {
                subject = SUBJECT_ON_SALE_ARCHIVED_RU;
                template = COMPANY_SALE_ARCHIVED_RU;
            }

            Message message = Message.builder()
                    .subject(subject)
                    .args(modelMap)
                    .template(template)
                    .body("")
                    .build();

            RecipientDto recipient = EmailHelper.mapEmployeeToRecipientDto(targetEmployee);
            mailService.sendMail(recipient, message);
        }
    }

    @EventListener(MailExpressSaleCreatedEvent.class)
    public void onExpressSaleCreated(MailExpressSaleCreatedEvent event) {
        String crmUrl = applicationProperties.getUrl();

        CompanySale sale = event.getCompanySale();
        Employee responsible = sale.getResponsible();
        Employee vn = employeeService.findByLogin(VN_LOGIN);

        List<Employee> recipients = Arrays.asList(responsible, vn);

        for (Employee targetEmployee : recipients) {
            Map<String, Object> modelMap = new HashMap<>();
            modelMap.put(KEY_FIO, String.format(EMPLOYEE_NAME_TEMPLATE,
                    responsible.getFirstName(), responsible.getLastName()));
            modelMap.put(KEY_URL, String.format(SALE_URL_TEMPLATE,
                    crmUrl, sale.getId()));
            modelMap.put(KEY_SALE, sale.getCompany().getName());

            String subject;
            Message.Template template;
            if (LANGUAGE_TAG_EN.equalsIgnoreCase(targetEmployee.getEmployeeLang())) {
                subject = SUBJECT_ON_MAIL_EXPRESS_SALE_CREATED_EN;
                template = MAIL_EXPRESS_SALE_CREATED_EN;
            } else {
                subject = SUBJECT_ON_MAIL_EXPRESS_SALE_CREATED_RU;
                template = MAIL_EXPRESS_SALE_CREATED_RU;
            }

            Message message = Message.builder()
                    .subject(subject)
                    .args(modelMap)
                    .template(template)
                    .body("")
                    .build();

            RecipientDto recipient = EmailHelper.mapEmployeeToRecipientDto(targetEmployee);
            mailService.sendMail(recipient, message);
        }
    }

    @EventListener(MailImportSaleActivityCreatedEvent.class)
    public void onActivityCreatedFromImportSale(MailImportSaleActivityCreatedEvent event) {
        String crmUrl = applicationProperties.getUrl();

        CompanySale sale = event.getCompanySale();
        Employee responsible = event.getSpecifiedResponsible();

        Map<String, Object> modelMap = new HashMap<>();
        modelMap.put(KEY_FIO, String.format(EMPLOYEE_NAME_TEMPLATE,
                responsible.getFirstName(), responsible.getLastName()));
        modelMap.put(KEY_URL, String.format(SALE_URL_TEMPLATE,
                crmUrl, sale.getId()));
        modelMap.put(KEY_SALE, sale.getCompany().getName());

        String subject;
        Message.Template template;
        if (LANGUAGE_TAG_EN.equalsIgnoreCase(responsible.getEmployeeLang())) {
            subject = SUBJECT_UNABLE_TO_ASSIGN_AS_RESPONSIBLE_EN;
            template = IMPORT_SALE_ACTIVITY_CREATED_EN;
        } else {
            subject = SUBJECT_UNABLE_TO_ASSIGN_AS_RESPONSIBLE_RU;
            template = IMPORT_SALE_ACTIVITY_CREATED_RU;
        }

        Message message = Message.builder()
                .subject(subject)
                .args(modelMap)
                .template(template)
                .body("")
                .build();

        RecipientDto recipient = EmailHelper.mapEmployeeToRecipientDto(responsible);
        mailService.sendMail(recipient, message);
    }
}
