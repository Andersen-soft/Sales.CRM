package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.entities.Company;
import com.andersenlab.crm.model.entities.CompanySale;
import com.andersenlab.crm.model.entities.EstimationRequest;
import com.andersenlab.crm.rest.response.EstimationRequestReportResponse;
import com.andersenlab.crm.rest.sample.EmployeeSample;
import com.andersenlab.crm.utils.CrmReportUtils;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import static com.andersenlab.crm.utils.ConverterHelper.getEmptyIfNull;
import static com.andersenlab.crm.utils.CrmReportUtils.replaceNullField;

@Component
@AllArgsConstructor
public class EstimationRequestToEstimationRequestReportResponseConverter
        implements Converter<EstimationRequest, EstimationRequestReportResponse> {

    private final ConversionService conversionService;

    @Override
    public EstimationRequestReportResponse convert(EstimationRequest source) {
        EstimationRequestReportResponse target = new EstimationRequestReportResponse();
        target.setId(source.getId());
        target.setName(replaceNullField(source.getName()));
        target.setDeadline(getEmptyIfNull(source.getDeadline(), localDateTime -> localDateTime.format(CrmReportUtils.DATE_FORMATTER)));
        target.setCompanyName(getEmptyIfNull(source.getCompany(), Company::getName));
        target.setResponsibleForSaleRequest(replaceNullEmployee(
                conversionService.convert(source.getResponsibleForSaleRequest(), EmployeeSample.class)));
        target.setStatus(getEmptyIfNull(source.getStatus(), EstimationRequest.Status::getName));
        target.setSaleId(replaceNullField(getOnlyActiveSaleId(source.getCompanySale())));
        target.setResponsibleForRequest(replaceNullEmployee(
                conversionService.convert(source.getResponsibleForRequest(), EmployeeSample.class)));
        target.setCreateDate(getEmptyIfNull(source.getCreateDate(), localDateTime -> localDateTime.format(CrmReportUtils.DATE_FORMATTER)));
        return target;
    }

    private Long getOnlyActiveSaleId(CompanySale companySale) {
        if (companySale == null) {
            return null;
        }
        return Boolean.TRUE.equals(companySale.getIsActive()) ? companySale.getId() : null;
    }

    public static EmployeeSample replaceNullEmployee(EmployeeSample field) {
        return field != null ? field : new EmployeeSample();
    }

    @Override
    public Class<EstimationRequest> getSource() {
        return EstimationRequest.class;
    }

    @Override
    public Class<EstimationRequestReportResponse> getTarget() {
        return EstimationRequestReportResponse.class;
    }
}
