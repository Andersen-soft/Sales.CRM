package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.entities.SaleRequestType;
import com.andersenlab.crm.model.view.SaleReport;
import com.andersenlab.crm.repositories.IndustryRepository;
import com.andersenlab.crm.rest.response.IndustryDto;
import com.andersenlab.crm.rest.response.SaleReportResponse;
import com.andersenlab.crm.services.i18n.I18nService;
import com.andersenlab.crm.utils.CrmReportUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import static com.andersenlab.crm.services.i18n.I18nConstants.LANGUAGE_TAG_EN;
import static com.andersenlab.crm.utils.CrmConstants.NO_VALUE_REPLACER;

@Component
@RequiredArgsConstructor
public class SaleReportToSaleReportResponseConverter implements Converter<SaleReport, SaleReportResponse> {
    private final I18nService i18nService;
    private final IndustryRepository industryRepository;
    private final IndustryToIndustryResponseConverter industryToIndustryResponseConverter;

    @Override
    public SaleReportResponse convert(SaleReport source) {
        SaleReportResponse target = new SaleReportResponse();
        target.setCreateDate(source.getCreateDate());
        target.setSourceId(source.getSourceId());
        target.setSourceName(source.getSourceName());
        target.setId(source.getId());
        target.setStatus(source.getStatus().getName());
        target.setStatusChangedDate(source.getStatusChangedDate());
        target.setStatusDate(source.getStatusDate());
        target.setCategory(source.getCategory());
        target.setResponsibleId(source.getResponsibleId());
        target.setResponsibleName(source.getResponsibleName());
        target.setWeight(source.getWeight());
        target.setCompanyName(source.getCompanyName());
        target.setCompanyUrl(source.getCompanyUrl());
        target.setCompanyResponsibleRmId(source.getCompanyResponsibleRmId());
        target.setCompanyResponsibleRmName(source.getCompanyResponsibleRmName());
        target.setCompanyRecommendationId(source.getCompanyRecommendationId());
        target.setCompanyRecommendationName(source.getCompanyRecommendationName());
        target.setMainContact(source.getMainContact());
        target.setContactPosition(source.getContactPosition());
        target.setEmail(source.getEmail());
        target.setSkype(source.getSkype());
        target.setSocialNetwork(source.getSocialNetwork());
        target.setSocialContact(source.getSocialContactName());
        target.setPhone(source.getPhone());
        target.setPersonalEmail(source.getPersonalEmail());
        target.setCountryId(source.getCountryId());
        target.setCountry(source.getCountryName());
        target.setLastActivityDate(source.getLastActivityDate());
        target.setRequestType(source.getType().getName());
        target.setRequestNames(CrmReportUtils.parseRequests(source.getResumeRequests(), SaleRequestType.RESUME));
        target.getRequestNames().addAll(CrmReportUtils.parseRequests(source.getEstimationRequests(), SaleRequestType.ESTIMATION));
        target.setIndustries(getIndustryDtoList(source.getCompanyIndustries()));
        return target;
    }

    @Override
    public SaleReportResponse convertWithLocale(SaleReport source, Locale locale) {
        SaleReportResponse target = convert(source);
        target.setStatus(i18nService.getLocalizedMessage(target.getStatus(), locale));
        target.setRequestType(i18nService.getLocalizedMessage(target.getRequestType(), locale));

        target.getRequestNames().forEach(v -> v.setType(i18nService.getLocalizedMessage(v.getType(), locale)));

        if (LANGUAGE_TAG_EN.equalsIgnoreCase(locale.getLanguage())) {
            target.setSourceName(source.getSourceNameEn());
            target.setCountry(source.getCountryNameEn());
        }

        return target;
    }

    @Override
    public Class<SaleReport> getSource() {
        return SaleReport.class;
    }

    @Override
    public Class<SaleReportResponse> getTarget() {
        return SaleReportResponse.class;
    }

    private List<IndustryDto> getIndustryDtoList(String source) {
        if (source != null && !source.isEmpty() && !source.equalsIgnoreCase(NO_VALUE_REPLACER)) {
            List<IndustryDto> result = new ArrayList<>();
            String[] names = source.split("#=#");
            for (String name : names) {
                result.add(industryToIndustryResponseConverter.convert(industryRepository.findByName(name)));
            }
            return result;
        } else {
            return new ArrayList<>();
        }
    }
}
