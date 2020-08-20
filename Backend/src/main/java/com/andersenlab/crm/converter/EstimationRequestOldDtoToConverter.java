package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.entities.Company;
import com.andersenlab.crm.model.entities.EstimationRequest;
import com.andersenlab.crm.rest.dto.EstimationRequestOldDto;
import com.andersenlab.crm.utils.ConverterHelper;
import org.springframework.stereotype.Service;

@Service
public class EstimationRequestOldDtoToConverter implements Converter<EstimationRequest, EstimationRequestOldDto> {
    @Override
    public EstimationRequestOldDto convert(EstimationRequest source) {
        EstimationRequestOldDto target = new EstimationRequestOldDto();
        target.setId(source.getId());
        target.setName(source.getName());
        target.setOldId(source.getOldId());
        target.setCompanyId(ConverterHelper.getNullable(source.getCompany(), Company::getId));
        return target;
    }

    @Override
    public Class<EstimationRequest> getSource() {
        return EstimationRequest.class;
    }

    @Override
    public Class<EstimationRequestOldDto> getTarget() {
        return EstimationRequestOldDto.class;
    }
}
