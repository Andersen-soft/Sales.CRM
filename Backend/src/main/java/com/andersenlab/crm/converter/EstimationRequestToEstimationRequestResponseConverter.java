package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.entities.Company;
import com.andersenlab.crm.model.entities.CompanySale;
import com.andersenlab.crm.model.entities.EstimationRequest;
import com.andersenlab.crm.rest.dto.file.FileDto;
import com.andersenlab.crm.rest.response.CompanyResponse;
import com.andersenlab.crm.rest.response.EmployeeResponse;
import com.andersenlab.crm.rest.response.EstimationRequestResponse;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Collections;

import static com.andersenlab.crm.utils.ConverterHelper.getNullable;
import static java.util.Optional.ofNullable;

/**
 * @author Yevhenii Pshenychnyi
 */
@Component
@AllArgsConstructor
public class EstimationRequestToEstimationRequestResponseConverter
        implements Converter<EstimationRequest, EstimationRequestResponse> {

    private final ConversionService conversionService;

    @Override
    public EstimationRequestResponse convert(EstimationRequest source) {
        EstimationRequestResponse target = new EstimationRequestResponse();
        target.setId(source.getId());
        target.setName(source.getName());
        ofNullable(source.getDeadline()).ifPresent(date -> target.setDeadline(date.toLocalDate()));
        target.setIsActive(source.getIsActive());
        target.setEstimations(conversionService
                .convertToList(ofNullable(source.getEstimations()).orElse(Collections.emptyList()), FileDto.class));
        target.setCompany(conversionService.convert(source.getCompany(), CompanyResponse.class));
        target.setCompanyName(getNullable(source.getCompany(), Company::getName));
        target.setResponsibleForSaleRequest(conversionService.convert(source.getResponsibleForSaleRequest(), EmployeeResponse.class));
        target.setStatus(getNullable(source.getStatus(), EstimationRequest.Status::getName));
        ofNullable(source.getCompanySale()).ifPresent(sale -> target.setSaleId(getOnlyActiveSaleId(sale)));
        target.setResponsibleForRequest(conversionService.convert(source.getResponsibleForRequest(), EmployeeResponse.class));
        ofNullable(source.getCreateDate()).ifPresent(date -> target.setCreateDate(date.toLocalDate()));
        return target;
    }

    private Long getOnlyActiveSaleId(CompanySale companySale){
        return Boolean.TRUE.equals(companySale.getIsActive()) ? companySale.getId() : null;
    }

    @Override
    public Class<EstimationRequest> getSource() {
        return EstimationRequest.class;
    }

    @Override
    public Class<EstimationRequestResponse> getTarget() {
        return EstimationRequestResponse.class;
    }

}
