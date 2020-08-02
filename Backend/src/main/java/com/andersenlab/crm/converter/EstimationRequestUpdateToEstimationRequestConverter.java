package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.entities.Company;
import com.andersenlab.crm.model.entities.CompanySale;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.model.entities.EstimationRequest;
import com.andersenlab.crm.rest.request.EstimationRequestUpdate;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.LocalTime;

import static com.andersenlab.crm.utils.ServiceUtils.getByNameOrThrow;
import static java.util.Optional.ofNullable;

@Component
public class EstimationRequestUpdateToEstimationRequestConverter implements
        Converter<EstimationRequestUpdate, EstimationRequest> {

    @Override
    public EstimationRequest convert(EstimationRequestUpdate source) {
        EstimationRequest estimationRequest = new EstimationRequest();
        ofNullable(source.getDeadLine())
                .ifPresent(date -> estimationRequest.setDeadline(LocalDateTime.of(date, LocalTime.MIN)));
        ofNullable(source.getResponsibleId())
                .ifPresent(id -> estimationRequest.setResponsibleRM(new Employee(id)));
        ofNullable(source.getCompanyId())
                .ifPresent(id -> estimationRequest.setCompany(new Company(id)));
        ofNullable(source.getStatus())
                .ifPresent(status -> estimationRequest.setStatus(getByNameOrThrow(EstimationRequest.Status.class, status)));
        ofNullable(source.getName())
                .ifPresent(estimationRequest::setName);
        ofNullable(source.getCompanySaleId())
                .ifPresent(saleId -> estimationRequest.setCompanySale(new CompanySale(saleId)));
        ofNullable(source.getResponsibleForRequestId())
                .ifPresent(resp -> estimationRequest.setResponsibleForRequest(new Employee(resp)));
        return estimationRequest;

    }

    @Override
    public Class<EstimationRequestUpdate> getSource() {
        return EstimationRequestUpdate.class;
    }

    @Override
    public Class<EstimationRequest> getTarget() {
        return EstimationRequest.class;
    }
}
