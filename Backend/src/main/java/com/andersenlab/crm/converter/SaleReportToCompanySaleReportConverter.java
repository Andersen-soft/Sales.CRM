package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.entities.CompanySale;
import com.andersenlab.crm.model.entities.SaleRequestType;
import com.andersenlab.crm.model.view.SaleReport;
import com.andersenlab.crm.rest.response.CompanySaleReportResponse;
import com.andersenlab.crm.rest.response.SaleRequestDto;
import com.andersenlab.crm.utils.CrmReportUtils;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

import static com.andersenlab.crm.utils.ConverterHelper.getEmptyIfNull;
import static com.andersenlab.crm.utils.CrmConstants.NO_VALUE_REPLACER;
import static com.andersenlab.crm.utils.CrmConstants.SOURCE_NAME_REFERENCE;
import static com.andersenlab.crm.utils.CrmConstants.SOURCE_NAME_REFERENCE_RU;
import static com.andersenlab.crm.utils.CrmReportUtils.DATE_FORMATTER;
import static com.andersenlab.crm.utils.CrmReportUtils.composeHyperlinkForLocale;
import static com.andersenlab.crm.utils.CrmReportUtils.replaceNullField;
import static com.andersenlab.crm.utils.CrmReportUtils.replaceTemplateField;
import static org.apache.commons.lang3.StringUtils.EMPTY;

@Component
public class SaleReportToCompanySaleReportConverter implements Converter<SaleReport, CompanySaleReportResponse> {
    @Override
    public CompanySaleReportResponse convert(SaleReport source) {
        CompanySaleReportResponse target = new CompanySaleReportResponse();
        target.setSourceName(replaceTemplateField(source.getSourceName()));
        if (SOURCE_NAME_REFERENCE.equalsIgnoreCase(source.getSourceName())
                || SOURCE_NAME_REFERENCE_RU.equalsIgnoreCase(source.getSourceName())) {
            target.setCompanyRecommendationName(replaceNullField(source.getCompanyRecommendationName()));
        } else {
            target.setCompanyRecommendationName(EMPTY);
        }
        target.setCreateDate(getEmptyIfNull(source.getCreateDate(), localDateTime -> localDateTime.format(DATE_FORMATTER)));
        target.setStatus(getEmptyIfNull(source.getStatus(), CompanySale.Status::getName));
        target.setCategory(replaceNullField(source.getCategory()));
        target.setStatusChangedDate(getEmptyIfNull(source.getStatusDate(), localDate -> localDate.format(DATE_FORMATTER)));
        target.setResponsibleName(replaceTemplateField(source.getResponsibleName()));
        target.setWeight(replaceNullField(source.getWeight()));
        target.setCompanyName(composeHyperlinkForLocale(replaceNullField(source.getCompanyName()), source.getId().toString(), "/sales/{id}", Locale.ENGLISH));
        target.setResponsibleRmName(replaceNullField(source.getCompanyResponsibleRmName()));
        target.setCompanyUrl(replaceNullField(source.getCompanyUrl()));
        target.setMainContact(replaceNullField(source.getMainContact()));
        target.setContactPosition(replaceNullField(source.getContactPosition()));
        target.setEmail(replaceNullField(source.getEmail()));
        target.setSkype(replaceNullField(source.getSkype()));
        target.setSocialNetwork(replaceNullField(source.getSocialNetwork()));
        target.setSocialContact(replaceTemplateField(source.getSocialContactName()));
        target.setPhone(replaceNullField(source.getPhone()));
        target.setPersonalEmail(replaceNullField(source.getPersonalEmail()));
        target.setCountry(replaceTemplateField(source.getCountryName()));
        target.setLastActivityDate(getEmptyIfNull(source.getLastActivityDate(), localDate -> localDate.format(DATE_FORMATTER)));
        target.setRequestType(replaceTemplateField(source.getType().getName()));
        target.setRequestNames(getRequest(source.getResumeRequests(), source.getEstimationRequests()));
        target.setIndustries(replaceNullField(getIndustriesForReport(source.getCompanyIndustries())));
        return target;
    }


    private String getRequest(String resumeRequests, String estimationRequests) {
        List<SaleRequestDto> requestDtos = CrmReportUtils.parseRequests(resumeRequests, SaleRequestType.RESUME);
        requestDtos.addAll(CrmReportUtils.parseRequests(estimationRequests, SaleRequestType.ESTIMATION));
        List<String> requestsNames = requestDtos.stream().map(SaleRequestDto::getName).collect(Collectors.toList());
        return  String.join(", ", requestsNames);
    }

    private String getIndustriesForReport(String source) {
        if (source != null && !source.isEmpty() && !source.equalsIgnoreCase(NO_VALUE_REPLACER)) {
            List<String> companyIndustries = Arrays.stream(source.split("#=#")).collect(Collectors.toList());
            return String.join(", ", companyIndustries);
        } else return null;
    }

    @Override
    public Class<SaleReport> getSource() {
        return SaleReport.class;
    }

    @Override
    public Class<CompanySaleReportResponse> getTarget() {
        return CompanySaleReportResponse.class;
    }
}