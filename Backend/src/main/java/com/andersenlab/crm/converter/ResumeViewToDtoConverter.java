package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.view.ResumeView;
import com.andersenlab.crm.rest.dto.EmployeeDto;
import com.andersenlab.crm.rest.response.ResumeViewResponse;
import com.andersenlab.crm.rest.sample.ResumeRequestSample;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class ResumeViewToDtoConverter implements Converter<ResumeView, ResumeViewResponse> {
    private final ConversionService conversionService;


    @Override
    public Class<ResumeView> getSource() {
        return ResumeView.class;
    }

    @Override
    public Class<ResumeViewResponse> getTarget() {
        return ResumeViewResponse.class;
    }

    @Override
    public ResumeViewResponse convert(ResumeView source) {
        ResumeViewResponse target = new ResumeViewResponse();
        target.setId(source.getId());
        Optional.ofNullable(source.getDeadline()).ifPresent(deadline -> target.setDeadline(deadline.toLocalDate()));
        Optional.ofNullable(source.getResumeRequest()).ifPresent(request ->
                target.setResumeRequestSample(conversionService.convert(request, ResumeRequestSample.class)));
        target.setFio(source.getFio());
        Optional.ofNullable(source.getStatus()).ifPresent(status -> target.setStatus(status.getName()));
        target.setEmployeeDto(conversionService.convert(source.getResponsibleHr(), EmployeeDto.class));
        target.setComment(source.getComment());
        target.setIsUrgent(source.isUrgent());
        target.setDateCreated(source.getCreateDate());
        return target;
    }
}
