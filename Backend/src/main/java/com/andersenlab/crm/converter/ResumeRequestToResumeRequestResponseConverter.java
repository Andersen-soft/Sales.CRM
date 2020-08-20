package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.entities.Company;
import com.andersenlab.crm.model.entities.CompanySale;
import com.andersenlab.crm.model.entities.ResumeRequest;
import com.andersenlab.crm.rest.response.ResumeRequestResponse;
import com.andersenlab.crm.rest.sample.EmployeeSample;
import com.andersenlab.crm.rest.sample.ResumeSample;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

import static com.andersenlab.crm.utils.ConverterHelper.getNullable;

/**
 * Provides type conversion ResumeRequest-to-ResumeRequestResponse
 */
@Component
@AllArgsConstructor
public class ResumeRequestToResumeRequestResponseConverter implements Converter<ResumeRequest, ResumeRequestResponse> {

    private final ConversionService conversionService;

    @Override
    public ResumeRequestResponse convert(ResumeRequest source) {
        ResumeRequestResponse target = new ResumeRequestResponse();
        target.setId(source.getId());
        target.setOldId(source.getOldId());
        target.setName(source.getName());
        Optional.ofNullable(source.getDeadline()).ifPresent(date -> target.setDeadLine(date.toLocalDate()));
        target.setStartAt(source.getStartAt());
        target.setIsActive(source.getIsActive());
        target.setIsFavorite(source.getIsFavorite());
        target.setPriority(getNullable(source.getPriority(), ResumeRequest.Priority::getName));
        target.setStatus(getNullable(source.getStatus(), ResumeRequest.Status::getName));
        target.setResumes(conversionService.convertToList(source.getResumes(), ResumeSample.class));
        target.setCompanyName(getNullable(source.getCompany(), Company::getName));
        target.setResponsibleForRequest(conversionService.convert(source.getResponsibleForRequest(), EmployeeSample.class));
        target.setResponsibleRm(conversionService.convert(source.getResponsibleRM(), EmployeeSample.class));
        target.setSaleId(getNullable(source.getCompanySale(), CompanySale::getId));
        return target;
    }

    @Override
    public Class<ResumeRequest> getSource() {
        return ResumeRequest.class;
    }

    @Override
    public Class<ResumeRequestResponse> getTarget() {
        return ResumeRequestResponse.class;
    }
}
