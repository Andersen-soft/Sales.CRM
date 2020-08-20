package com.andersenlab.crm.converter.resumerequest;

import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.entities.Company;
import com.andersenlab.crm.model.entities.CompanySale;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.model.entities.ResumeRequest;
import com.andersenlab.crm.rest.dto.resumerequest.ResumeRequestDtoUpdate;
import com.andersenlab.crm.utils.ServiceUtils;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.LocalTime;

import static java.util.Optional.ofNullable;

@Component
public class ResumeRequestFromResumeRequestDtoUpdate implements Converter<ResumeRequestDtoUpdate, ResumeRequest> {

    @Override
    public ResumeRequest convert(ResumeRequestDtoUpdate source) {
        ResumeRequest target = new ResumeRequest();
        ofNullable(source.getName()).ifPresent(target::setName);
        ofNullable(source.getCompanyId()).ifPresent(s -> target.setCompany(new Company(s)));
        ofNullable(source.getResponsibleId()).ifPresent(s -> target.setResponsibleRM(new Employee(s)));
        ofNullable(source.getStatus())
                .ifPresent(s -> target.setStatus(ServiceUtils.getByNameOrThrow(ResumeRequest.Status.class, s)));
        ofNullable(source.getDeadLine()).ifPresent(date -> target.setDeadline(LocalDateTime.of(date, LocalTime.MIN)));
        ofNullable(source.getPriority()).ifPresent(s ->
                target.setPriority(ServiceUtils.getByNameOrThrow(ResumeRequest.Priority.class, s)));
        ofNullable(source.getCompanySaleId()).ifPresent(s -> target.setCompanySale(new CompanySale(s)));
        return target;
    }

    @Override
    public Class<ResumeRequestDtoUpdate> getSource() {
        return ResumeRequestDtoUpdate.class;
    }

    @Override
    public Class<ResumeRequest> getTarget() {
        return ResumeRequest.class;
    }

}
