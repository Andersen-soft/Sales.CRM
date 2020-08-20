package com.andersenlab.crm.converter;

import static com.andersenlab.crm.model.entities.CompanySale.Status.PRELEAD;
import static com.andersenlab.crm.model.entities.CompanySale.Status.LEAD;
import static com.andersenlab.crm.model.entities.CompanySale.Status.INWORK;
import static com.andersenlab.crm.model.entities.CompanySale.Status.OPPORTUNITY;
import static com.andersenlab.crm.model.entities.CompanySale.Status.CONTRACT;
import static com.andersenlab.crm.model.entities.CompanySale.Status.ARCHIVE;
import static com.andersenlab.crm.utils.CrmReportUtils.concatSales;
import static com.andersenlab.crm.utils.CrmReportUtils.getSalesByStatus;
import static com.andersenlab.crm.utils.CrmReportUtils.replaceNullField;

import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.dbtools.dto.CompanyReport;
import com.andersenlab.crm.rest.response.CompanyResponseReport;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class CompanyReportToCompanyResponseReport implements Converter<CompanyReport, CompanyResponseReport> {

    @Override
    public CompanyResponseReport convert(CompanyReport source) {

        Map<Integer, List<String>> salesByStatus = getSalesByStatus(source.getSales());

        CompanyResponseReport target = new CompanyResponseReport();
        target.setName(replaceNullField(source.getName()));
        target.setUrl(replaceNullField(source.getUrl()));
        target.setPhone(replaceNullField(source.getPhone()));
        target.setDescription(replaceNullField(source.getDescription()));

        target.setPreLead(concatSales(salesByStatus.get(PRELEAD.ordinal())));
        target.setLead(concatSales(salesByStatus.get(LEAD.ordinal())));
        target.setInWork(concatSales(salesByStatus.get(INWORK.ordinal())));
        target.setOpportunity(concatSales(salesByStatus.get(OPPORTUNITY.ordinal())));
        target.setContract(concatSales(salesByStatus.get(CONTRACT.ordinal())));
        target.setArchive(concatSales(salesByStatus.get(ARCHIVE.ordinal())));
        return target;
    }

    @Override
    public Class<CompanyReport> getSource() {
        return CompanyReport.class;
    }

    @Override
    public Class<CompanyResponseReport> getTarget() {
        return CompanyResponseReport.class;
    }
}
