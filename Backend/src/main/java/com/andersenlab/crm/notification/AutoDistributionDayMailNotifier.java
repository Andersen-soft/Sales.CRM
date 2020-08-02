package com.andersenlab.crm.notification;

import com.andersenlab.crm.configuration.properties.ApplicationProperties;
import com.andersenlab.crm.events.DayDistributionEmployeeSetEvent;
import com.andersenlab.crm.events.DayDistributionNoParticipantsEvent;
import com.andersenlab.crm.events.DayDistributionRejectedSaleEvent;
import com.andersenlab.crm.events.DayDistributionSaleRemovedEvent;
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

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.andersenlab.crm.model.Message.Template.AUTO_DISTRIBUTION_DAY_NO_PARTICIPANTS_EN;
import static com.andersenlab.crm.model.Message.Template.AUTO_DISTRIBUTION_DAY_NO_PARTICIPANTS_RU;
import static com.andersenlab.crm.model.Message.Template.AUTO_DISTRIBUTION_DAY_SALE_REJECTED_EN;
import static com.andersenlab.crm.model.Message.Template.AUTO_DISTRIBUTION_DAY_SALE_REJECTED_RU;
import static com.andersenlab.crm.model.Message.Template.AUTO_DISTRIBUTION_DAY_SALE_REJECTED_SALES_HEADS_EN;
import static com.andersenlab.crm.model.Message.Template.AUTO_DISTRIBUTION_DAY_SALE_REJECTED_SALES_HEADS_RU;
import static com.andersenlab.crm.model.Message.Template.AUTO_DISTRIBUTION_DAY_SALE_REMOVED_EN;
import static com.andersenlab.crm.model.Message.Template.AUTO_DISTRIBUTION_DAY_SALE_REMOVED_RU;
import static com.andersenlab.crm.model.Message.Template.AUTO_DISTRIBUTION_DAY_SALE_SET_EN;
import static com.andersenlab.crm.model.Message.Template.AUTO_DISTRIBUTION_DAY_SALE_SET_RU;
import static com.andersenlab.crm.model.RoleEnum.ROLE_SALES_HEAD;
import static com.andersenlab.crm.services.i18n.I18nConstants.LANGUAGE_TAG_EN;

@Component
@RequiredArgsConstructor
public class AutoDistributionDayMailNotifier {
    private final MailService mailService;
    private final EmployeeService employeeService;

    private final ApplicationProperties applicationProperties;

    private static final String KEY_FIO = "fio";
    private static final String KEY_FIO_SALES_HEAD = "fioSalesHead";
    private static final String KEY_SALE = "company";
    private static final String KEY_URL = "url";
    private static final String SALE_URL_TEMPLATE = "%s/sales/%d";
    private static final String EMPLOYEE_NAME_TEMPLATE = "%s %s";

    private static final String SUBJECT_ON_EMPLOYEE_SET_TEMPLATE_RU = "Автораспределение лидов";
    private static final String SUBJECT_ON_EMPLOYEE_SET_TEMPLATE_EN = "Auto assignment of leads";

    @EventListener(DayDistributionEmployeeSetEvent.class)
    public void onEmployeeResponsibleSet(DayDistributionEmployeeSetEvent event) {
        Employee targetEmployee = event.getEmployee();
        CompanySale sale = event.getCompanySale();
        Map<String, Object> modelMap = new HashMap<>();
        modelMap.put(KEY_FIO, String.format(EMPLOYEE_NAME_TEMPLATE,
                targetEmployee.getFirstName(), targetEmployee.getLastName()));
        modelMap.put(KEY_URL, String.format(SALE_URL_TEMPLATE,
                applicationProperties.getUrl(), sale.getId()));
        modelMap.put(KEY_SALE, sale.getCompany().getName());

        String subject;
        Message.Template template;
        if (LANGUAGE_TAG_EN.equalsIgnoreCase(targetEmployee.getEmployeeLang())) {
            subject = SUBJECT_ON_EMPLOYEE_SET_TEMPLATE_EN;
            template = AUTO_DISTRIBUTION_DAY_SALE_SET_EN;
        } else {
            subject = SUBJECT_ON_EMPLOYEE_SET_TEMPLATE_RU;
            template = AUTO_DISTRIBUTION_DAY_SALE_SET_RU;
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

    @EventListener(DayDistributionRejectedSaleEvent.class)
    public void onDayDistributionRejectedSale(DayDistributionRejectedSaleEvent event) {
        Employee targetEmployee = event.getEmployee();
        CompanySale sale = event.getCompanySale();

        Map<String, Object> modelMap = new HashMap<>();
        modelMap.put(KEY_FIO, String.format(EMPLOYEE_NAME_TEMPLATE,
                targetEmployee.getFirstName(), targetEmployee.getLastName()));
        modelMap.put(KEY_URL, String.format(SALE_URL_TEMPLATE,
                applicationProperties.getUrl(), sale.getId()));
        modelMap.put(KEY_SALE, sale.getCompany().getName());

        String subject;
        Message.Template template;
        if (LANGUAGE_TAG_EN.equalsIgnoreCase(targetEmployee.getEmployeeLang())) {
            subject = SUBJECT_ON_EMPLOYEE_SET_TEMPLATE_EN;
            template = AUTO_DISTRIBUTION_DAY_SALE_REJECTED_EN;
        } else {
            subject = SUBJECT_ON_EMPLOYEE_SET_TEMPLATE_RU;
            template = AUTO_DISTRIBUTION_DAY_SALE_REJECTED_RU;
        }

        RecipientDto recipient = EmailHelper.mapEmployeeToRecipientDto(targetEmployee);
        mailService.sendMail(recipient, Message.builder()
                .subject(subject)
                .args(modelMap)
                .template(template)
                .body("")
                .build());

        List<Employee> recipients = employeeService.getEmployeesByRole(ROLE_SALES_HEAD);

        for (Employee salesHead : recipients) {
            Map<String, Object> headsModelMap = new HashMap<>();
            headsModelMap.put(KEY_FIO, String.format(EMPLOYEE_NAME_TEMPLATE,
                    targetEmployee.getFirstName(), targetEmployee.getLastName()));
            headsModelMap.put(KEY_FIO_SALES_HEAD, String.format(EMPLOYEE_NAME_TEMPLATE,
                    salesHead.getFirstName(), salesHead.getLastName()));
            headsModelMap.put(KEY_URL, String.format(SALE_URL_TEMPLATE,
                    applicationProperties.getUrl(), sale.getId()));
            headsModelMap.put(KEY_SALE, sale.getCompany().getName());

            String headsSubject;
            Message.Template headsTemplate;
            if (LANGUAGE_TAG_EN.equalsIgnoreCase(salesHead.getEmployeeLang())) {
                headsSubject = SUBJECT_ON_EMPLOYEE_SET_TEMPLATE_EN;
                headsTemplate = AUTO_DISTRIBUTION_DAY_SALE_REJECTED_SALES_HEADS_EN;
            } else {
                headsSubject = SUBJECT_ON_EMPLOYEE_SET_TEMPLATE_RU;
                headsTemplate = AUTO_DISTRIBUTION_DAY_SALE_REJECTED_SALES_HEADS_RU;
            }

            RecipientDto targetSalesHead = EmailHelper.mapEmployeeToRecipientDto(salesHead);

            mailService.sendMail(targetSalesHead, Message.builder()
                    .subject(headsSubject)
                    .args(headsModelMap)
                    .template(headsTemplate)
                    .body("")
                    .build());
        }
    }

    @EventListener(DayDistributionNoParticipantsEvent.class)
    public void onMissingDayDistributionParticipants(DayDistributionNoParticipantsEvent event) {
        CompanySale sale = event.getCompanySale();
        List<Employee> recipients = employeeService.getEmployeesByRole(ROLE_SALES_HEAD);
        for (Employee targetEmployee : recipients) {
            Map<String, Object> modelMap = new HashMap<>();
            modelMap.put(KEY_FIO, String.format(EMPLOYEE_NAME_TEMPLATE,
                    targetEmployee.getFirstName(), targetEmployee.getLastName()));
            modelMap.put(KEY_URL, String.format(SALE_URL_TEMPLATE,
                    applicationProperties.getUrl(), sale.getId()));
            modelMap.put(KEY_SALE, sale.getCompany().getName());

            String subject;
            Message.Template template;
            if (LANGUAGE_TAG_EN.equalsIgnoreCase(targetEmployee.getEmployeeLang())) {
                subject = SUBJECT_ON_EMPLOYEE_SET_TEMPLATE_EN;
                template = AUTO_DISTRIBUTION_DAY_NO_PARTICIPANTS_EN;
            } else {
                subject = SUBJECT_ON_EMPLOYEE_SET_TEMPLATE_RU;
                template = AUTO_DISTRIBUTION_DAY_NO_PARTICIPANTS_RU;
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

    @EventListener(DayDistributionSaleRemovedEvent.class)
    public void onSaleRemovedFromDayDistribution(DayDistributionSaleRemovedEvent event) {
        Employee targetEmployee = event.getEmployee();
        CompanySale sale = event.getCompanySale();
        Map<String, Object> modelMap = new HashMap<>();
        modelMap.put(KEY_FIO, String.format(EMPLOYEE_NAME_TEMPLATE,
                targetEmployee.getFirstName(), targetEmployee.getLastName()));
        modelMap.put(KEY_URL, String.format(SALE_URL_TEMPLATE,
                applicationProperties.getUrl(), sale.getId()));
        modelMap.put(KEY_SALE, sale.getCompany().getName());

        String subject;
        Message.Template template;
        if (LANGUAGE_TAG_EN.equalsIgnoreCase(targetEmployee.getEmployeeLang())) {
            subject = SUBJECT_ON_EMPLOYEE_SET_TEMPLATE_EN;
            template = AUTO_DISTRIBUTION_DAY_SALE_REMOVED_EN;
        } else {
            subject = SUBJECT_ON_EMPLOYEE_SET_TEMPLATE_RU;
            template = AUTO_DISTRIBUTION_DAY_SALE_REMOVED_RU;
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
