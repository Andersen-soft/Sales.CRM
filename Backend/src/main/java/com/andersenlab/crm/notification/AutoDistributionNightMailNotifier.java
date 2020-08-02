package com.andersenlab.crm.notification;

import com.andersenlab.crm.configuration.properties.ApplicationProperties;
import com.andersenlab.crm.events.NightDistributionNoParticipantsEvent;
import com.andersenlab.crm.events.NightDistributionUnassignedSalesEvent;
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

import static com.andersenlab.crm.model.Message.Template.AUTO_DISTRIBUTION_NIGHT_NO_PARTICIPANTS_EN;
import static com.andersenlab.crm.model.Message.Template.AUTO_DISTRIBUTION_NIGHT_NO_PARTICIPANTS_RU;
import static com.andersenlab.crm.model.Message.Template.AUTO_DISTRIBUTION_NIGHT_UNASSIGNED_SALES_EN;
import static com.andersenlab.crm.model.Message.Template.AUTO_DISTRIBUTION_NIGHT_UNASSIGNED_SALES_RU;
import static com.andersenlab.crm.model.RoleEnum.ROLE_SALES_HEAD;
import static com.andersenlab.crm.services.i18n.I18nConstants.LANGUAGE_TAG_EN;

@Component
@RequiredArgsConstructor
public class AutoDistributionNightMailNotifier {
    private static final String KEY_FIO = "fio";
    private static final String KEY_SALE = "company";
    private static final String KEY_SALE_LIST = "sales";
    private static final String KEY_URL = "url";
    private static final String SALE_URL_TEMPLATE = "%s/sales/%d";
    private static final String SALE_NO_ID_URL_TEMPLATE = "%s/sales/";
    private static final String EMPLOYEE_NAME_TEMPLATE = "%s %s";

    private static final String SUBJECT_ON_EMPLOYEE_SET_TEMPLATE_RU = "Автораспределение лидов";
    private static final String SUBJECT_ON_EMPLOYEE_SET_TEMPLATE_EN = "Auto assignment of leads";

    private final EmployeeService employeeService;
    private final MailService mailService;
    private final ApplicationProperties applicationProperties;

    @EventListener(NightDistributionNoParticipantsEvent.class)
    public void onMissingNightDistributionParticipants(NightDistributionNoParticipantsEvent event) {
        String crmUrl = applicationProperties.getUrl();
        CompanySale sale = event.getCompanySale();
        List<Employee> recipients = employeeService.getEmployeesByRole(ROLE_SALES_HEAD);
        for (Employee targetEmployee : recipients) {
            Map<String, Object> modelMap = new HashMap<>();
            modelMap.put(KEY_FIO, String.format(EMPLOYEE_NAME_TEMPLATE,
                    targetEmployee.getFirstName(), targetEmployee.getLastName()));
            modelMap.put(KEY_URL, String.format(SALE_URL_TEMPLATE,
                    crmUrl, sale.getId()));
            modelMap.put(KEY_SALE, sale.getCompany().getName());

            String subject;
            Message.Template template;
            if (LANGUAGE_TAG_EN.equalsIgnoreCase(targetEmployee.getEmployeeLang())) {
                subject = SUBJECT_ON_EMPLOYEE_SET_TEMPLATE_EN;
                template = AUTO_DISTRIBUTION_NIGHT_NO_PARTICIPANTS_EN;
            } else {
                subject = SUBJECT_ON_EMPLOYEE_SET_TEMPLATE_RU;
                template = AUTO_DISTRIBUTION_NIGHT_NO_PARTICIPANTS_RU;
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

    @EventListener(NightDistributionUnassignedSalesEvent.class)
    public void onNightDistributionUnassignedSales(NightDistributionUnassignedSalesEvent event) {
        String crmUrl = applicationProperties.getUrl();
        List<Employee> recipients = employeeService.getEmployeesByRole(ROLE_SALES_HEAD);
        for (Employee targetEmployee : recipients) {
            Map<String, Object> modelMap = new HashMap<>();
            modelMap.put(KEY_FIO, String.format(EMPLOYEE_NAME_TEMPLATE,
                    targetEmployee.getFirstName(), targetEmployee.getLastName()));
            modelMap.put(KEY_URL, String.format(SALE_NO_ID_URL_TEMPLATE, crmUrl));
            modelMap.put(KEY_SALE_LIST, event.getUnassignedSales());

            String subject;
            Message.Template template;
            if (LANGUAGE_TAG_EN.equalsIgnoreCase(targetEmployee.getEmployeeLang())) {
                subject = SUBJECT_ON_EMPLOYEE_SET_TEMPLATE_EN;
                template = AUTO_DISTRIBUTION_NIGHT_UNASSIGNED_SALES_EN;
            } else {
                subject = SUBJECT_ON_EMPLOYEE_SET_TEMPLATE_RU;
                template = AUTO_DISTRIBUTION_NIGHT_UNASSIGNED_SALES_RU;
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
}
