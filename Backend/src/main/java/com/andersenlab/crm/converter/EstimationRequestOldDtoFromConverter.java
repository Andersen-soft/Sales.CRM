package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.entities.Company;
import com.andersenlab.crm.model.entities.EstimationRequest;
import com.andersenlab.crm.rest.dto.EstimationRequestOldDto;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class EstimationRequestOldDtoFromConverter implements Converter<EstimationRequestOldDto, EstimationRequest> {
    @Override
    public EstimationRequest convert(EstimationRequestOldDto source) {
        EstimationRequest target = new EstimationRequest();
        target.setName(source.getName());
        target.setOldId(source.getOldId());
        Optional.ofNullable(source.getCompanyId()).ifPresent(s -> target.setCompany(defineCompany(s)));
        return target;
    }

    @Override
    public Class<EstimationRequestOldDto> getSource() {
        return EstimationRequestOldDto.class;
    }

    @Override
    public Class<EstimationRequest> getTarget() {
        return EstimationRequest.class;
    }

    private Company defineCompany(Long id) {
        Company company = new Company();
        company.setId(id);
        return company;
    }
}
