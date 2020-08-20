package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.entities.CompanySale;
import com.andersenlab.crm.model.entities.Contact;
import com.andersenlab.crm.rest.response.ActivityResponse;
import com.andersenlab.crm.rest.response.CompanyResponse;
import com.andersenlab.crm.rest.response.CompanySaleResponse;
import com.andersenlab.crm.rest.response.ContactResponse;
import com.andersenlab.crm.rest.response.SourceResponse;
import com.andersenlab.crm.rest.sample.EmployeeSample;
import com.andersenlab.crm.rest.sample.EstimationRequestSample;
import com.andersenlab.crm.rest.sample.ResumeRequestSample;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Locale;

import static com.andersenlab.crm.services.i18n.I18nConstants.LANGUAGE_TAG_EN;
import static com.andersenlab.crm.utils.ConverterHelper.getNullable;
import static java.util.Optional.ofNullable;

@Component
@AllArgsConstructor
public class CompanySaleToCompanySaleResponseConverter implements Converter<CompanySale, CompanySaleResponse> {

    private final ConversionService conversionService;

    @Override
    public CompanySaleResponse convert(CompanySale source) {
        CompanySaleResponse target = new CompanySaleResponse();
        target.setId(source.getId());
        target.setResponsible(conversionService.convert(source.getResponsible(), EmployeeSample.class));
        target.setCreateDate(source.getCreateDate());
        ofNullable(source.getIsSaleApproved()).ifPresent(target::setSaleApproved);
        ofNullable(source.getLastActivity()).ifPresent(activity ->
                target.setLastActivity(conversionService.convert(activity, ActivityResponse.class)));
        ofNullable(source.getFirstActivity()).ifPresent(activity ->
                target.setFirstActivity(conversionService.convert(activity, ActivityResponse.class)));
        target.setNextActivityDate(source.getNextActivityDate());
        target.setDescription(source.getDescription());
        target.setMainContactId(getNullable(source.getMainContact(), Contact::getId));
        target.setMainContact(conversionService.convert(source.getMainContact(), ContactResponse.class));
        target.setResumes(conversionService.convertToList(source.getResumeRequests(), ResumeRequestSample.class));
        target.setEstimations(conversionService.convertToList(source.getEstimationRequests(), EstimationRequestSample.class));
        target.setCompany(conversionService.convert(source.getCompany(), CompanyResponse.class));
        target.setStatus(getNullable(source.getStatus(), CompanySale.Status::name));
        target.setWeight(source.getWeight());
        target.setInDayAutoDistribution(source.isInDayAutoDistribution());
        target.setDistributedEmployeeId(source.getDayDistributionEmployeeId());
        target.setSource(conversionService.convert(source.getSource(), SourceResponse.class));
        target.setRecommendation(conversionService.convert(source.getRecommendedBy(), CompanyResponse.class));
        target.setCategory(getNullable(source.getCategory(), CompanySale.Category::name));
        return target;
    }

    @Override
    public CompanySaleResponse convertWithLocale(CompanySale source, Locale locale) {
        CompanySaleResponse target = convert(source);
        if (LANGUAGE_TAG_EN.equalsIgnoreCase(locale.getLanguage())) {
            ofNullable(source.getSource()).ifPresent(s -> {
                target.getSource().setName(s.getNameEn());
                target.getSource().setDescription(s.getDescriptionEn());
            });
        }

        return target;
    }

    @Override
    public Class<CompanySale> getSource() {
        return CompanySale.class;
    }

    @Override
    public Class<CompanySaleResponse> getTarget() {
        return CompanySaleResponse.class;
    }
}
