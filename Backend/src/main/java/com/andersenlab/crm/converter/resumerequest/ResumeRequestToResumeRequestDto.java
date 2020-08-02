package com.andersenlab.crm.converter.resumerequest;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.entities.CompanySale;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.model.entities.File;
import com.andersenlab.crm.model.entities.ResumeRequest;
import com.andersenlab.crm.rest.dto.file.FileDto;
import com.andersenlab.crm.rest.response.CompanyResponse;
import com.andersenlab.crm.rest.response.EmployeeResponse;
import com.andersenlab.crm.rest.response.ResumeRequestDto;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

import static com.andersenlab.crm.utils.ConverterHelper.getNullable;

@Component
@AllArgsConstructor
public class ResumeRequestToResumeRequestDto implements Converter<ResumeRequest, ResumeRequestDto> {

    private final ConversionService conversionService;

    @Override
    public ResumeRequestDto convert(ResumeRequest source) {
        ResumeRequestDto target = new ResumeRequestDto();
        target.setId(source.getId());
        target.setName(source.getName());
        Optional.ofNullable(source.getCompany()).ifPresent(company -> {
            CompanyResponse response = conversionService.convert(company, CompanyResponse.class);
            target.setCompany(response);
        });
        Optional.ofNullable(source.getResponsibleRM()).ifPresent(s -> target.setResponsible(defineEmployee(s)));
        Optional.ofNullable(source.getResponsibleForSaleRequest()).ifPresent(s -> target.setResponsibleForSaleRequest(defineEmployee(s)));
        target.setStatus(getNullable(source.getStatus(), ResumeRequest.Status::getName));
        Optional.ofNullable(source.getDeadline()).ifPresent(date -> target.setDeadLine(date.toLocalDate()));
        target.setPriority(getNullable(source.getPriority(), ResumeRequest.Priority::getName));
        target.setSaleId(getNullable(source.getCompanySale(), CompanySale::getId));
        target.setCreated(source.getCreateDate());
        Optional.ofNullable(source.getFiles()).ifPresent(s -> target.setAttachments(defineAttachments(s)));
        target.setAutoDistribution(source.isAutoDistribution());
        return target;
    }

    @Override
    public Class<ResumeRequest> getSource() {
        return ResumeRequest.class;
    }

    @Override
    public Class<ResumeRequestDto> getTarget() {
        return ResumeRequestDto.class;
    }

    private EmployeeResponse defineEmployee(Employee source) {
        return conversionService.convert(source, EmployeeResponse.class);
    }

    private List<FileDto> defineAttachments(List<File> source) {
        return conversionService.convertToList(source, FileDto.class);
    }
}
