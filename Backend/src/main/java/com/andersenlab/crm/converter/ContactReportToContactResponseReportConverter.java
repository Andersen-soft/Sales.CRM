package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.dbtools.dto.ContactReport;
import com.andersenlab.crm.model.Sex;
import com.andersenlab.crm.rest.response.ContactResponseReport;
import com.andersenlab.crm.utils.CrmReportUtils;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

import static com.andersenlab.crm.model.entities.CompanySale.Status.ARCHIVE;
import static com.andersenlab.crm.model.entities.CompanySale.Status.CONTRACT;
import static com.andersenlab.crm.model.entities.CompanySale.Status.INWORK;
import static com.andersenlab.crm.model.entities.CompanySale.Status.LEAD;
import static com.andersenlab.crm.model.entities.CompanySale.Status.OPPORTUNITY;
import static com.andersenlab.crm.model.entities.CompanySale.Status.PRELEAD;
import static com.andersenlab.crm.utils.CrmReportUtils.concatSales;
import static com.andersenlab.crm.utils.CrmReportUtils.replaceNullField;

@Component
public class ContactReportToContactResponseReportConverter implements Converter<ContactReport, ContactResponseReport> {

    @Override
    public ContactResponseReport convert(ContactReport source) {
        ContactResponseReport target = new ContactResponseReport();

        Map<Integer, List<String>> salesByStatus = CrmReportUtils.getSalesByStatus(source.getSales());

        target.setFirstName(replaceNullField(source.getFirstName()));
        target.setLastName(replaceNullField(source.getLastName()));
        target.setCompany(replaceNullField(source.getCompany()));
        target.setPosition(replaceNullField(source.getPosition()));
        target.setEmail(replaceNullField(source.getEmail()));
        target.setSkype(replaceNullField(source.getSkype()));
        target.setSocialNetwork(replaceNullField(source.getSocialNetwork()));
        target.setSocialNetworkUser(replaceNullField(source.getSocialNetworkUser()));
        target.setPhone(replaceNullField(source.getPhone()));
        target.setPersonalEmail(replaceNullField(source.getPersonalEmail()));
        target.setCountry(replaceNullField(source.getCountry()));
        target.setSex(convertSex(replaceNullField(source.getSex())));
        target.setSource(replaceNullField(source.getSources()));
        target.setMainContact(convertMainContact(source.getMainContact()));
        target.setPreLead(concatSales(salesByStatus.get(PRELEAD.ordinal())));
        target.setLead(concatSales(salesByStatus.get(LEAD.ordinal())));
        target.setInWork(concatSales(salesByStatus.get(INWORK.ordinal())));
        target.setOpportunity(concatSales(salesByStatus.get(OPPORTUNITY.ordinal())));
        target.setContract(concatSales(salesByStatus.get(CONTRACT.ordinal())));
        target.setArchive(concatSales(salesByStatus.get(ARCHIVE.ordinal())));
        target.setDateOfBirth(replaceNullField(source.getDateOfBirth()));

        return target;
    }

    @Override
    public Class<ContactReport> getSource() {
        return ContactReport.class;
    }

    @Override
    public Class<ContactResponseReport> getTarget() {
        return ContactResponseReport.class;
    }

    private String convertMainContact(String resultSet) {
        return resultSet != null ? "Да" : "Нет";
    }

    private String convertSex(String resultSet) {
        if ("0".equals(resultSet)) {
            return Sex.MALE.getName();
        } else {
            return Sex.FEMALE.getName();
        }
    }
}
