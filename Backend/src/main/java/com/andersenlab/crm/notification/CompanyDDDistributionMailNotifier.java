package com.andersenlab.crm.notification;

import com.andersenlab.crm.configuration.properties.ApplicationProperties;
import com.andersenlab.crm.events.CompanyDistributionReferenceDiffEvent;
import com.andersenlab.crm.model.Message;
import com.andersenlab.crm.model.RecipientDto;
import com.andersenlab.crm.model.entities.Company;
import com.andersenlab.crm.model.entities.CompanySale;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.services.MailService;
import com.andersenlab.crm.utils.EmailHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.andersenlab.crm.model.Message.Template.COMPANY_DISTRIBUTION_REFERENCE_DIFF_EN;
import static com.andersenlab.crm.model.Message.Template.COMPANY_DISTRIBUTION_REFERENCE_DIFF_RU;
import static com.andersenlab.crm.services.i18n.I18nConstants.LANGUAGE_TAG_EN;

@Service
@RequiredArgsConstructor
public class CompanyDDDistributionMailNotifier {
    private static final String KEY_FIO = "fio";
    private static final String KEY_URL = "url";
    private static final String KEY_FIO_TARGET = "fioTarget";
    private static final String KEY_FIO_REFERENCE = "fioReference";
    private static final String KEY_COMPANY_NAME_TARGET = "companyTarget";
    private static final String KEY_COMPANY_NAME_REFERENCE = "companyReference";

    private static final String SALE_URL_TEMPLATE = "%s/sales/%d";
    private static final String EMPLOYEE_NAME_TEMPLATE = "%s %s";

    private static final String SUBJECT_ON_REFERENCE_DIFF_EN = "Recommending company";
    private static final String SUBJECT_ON_REFERENCE_DIFF_RU = "Референция от компании";

    private final MailService mailService;
    private final ApplicationProperties applicationProperties;

    @EventListener(CompanyDistributionReferenceDiffEvent.class)
    public void onReferenceCompanyDifferenceEvent(CompanyDistributionReferenceDiffEvent event) {
        CompanySale targetSale = event.getTargetSale();
        Company targetCompany = targetSale.getCompany();
        Company referenceCompany = event.getReferenceCompany();

        List<Employee> recipients = Arrays.asList(
                targetCompany.getResponsible(),
                referenceCompany.getResponsible()
        );

        for (Employee targetEmployee : recipients) {
            Map<String, Object> modelMap = new HashMap<>();
            modelMap.put(KEY_FIO, String.format(EMPLOYEE_NAME_TEMPLATE,
                    targetEmployee.getFirstName(), targetEmployee.getLastName()));
            modelMap.put(KEY_URL, String.format(SALE_URL_TEMPLATE,
                    applicationProperties.getUrl(), targetSale.getId()));
            modelMap.put(KEY_COMPANY_NAME_TARGET, targetCompany.getName());
            modelMap.put(KEY_COMPANY_NAME_REFERENCE, referenceCompany.getName());
            modelMap.put(KEY_FIO_TARGET, String.format(EMPLOYEE_NAME_TEMPLATE,
                    targetCompany.getResponsible().getFirstName(),
                    targetCompany.getResponsible().getLastName()));
            modelMap.put(KEY_FIO_REFERENCE, String.format(EMPLOYEE_NAME_TEMPLATE,
                    referenceCompany.getResponsible().getFirstName(),
                    referenceCompany.getResponsible().getLastName()));

            Message.Template template;
            String subject;
            if (LANGUAGE_TAG_EN.equalsIgnoreCase(targetEmployee.getEmployeeLang())) {
                subject = SUBJECT_ON_REFERENCE_DIFF_EN;
                template = COMPANY_DISTRIBUTION_REFERENCE_DIFF_EN;
            } else {
                subject = SUBJECT_ON_REFERENCE_DIFF_RU;
                template = COMPANY_DISTRIBUTION_REFERENCE_DIFF_RU;
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
