package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.entities.EstimationRequest;
import com.andersenlab.crm.rest.sample.EstimationRequestSample;
import org.springframework.stereotype.Component;

@Component
public class EstimationRequestToEstimationRequestSampleConverter implements Converter<EstimationRequest, EstimationRequestSample> {

    @Override
    public EstimationRequestSample convert(EstimationRequest source) {
        EstimationRequestSample sample = new EstimationRequestSample();
        sample.setId(source.getId());
        sample.setName(source.getName());
        sample.setOldId(source.getOldId());
        return sample;
    }

    @Override
    public Class<EstimationRequest> getSource() {
        return EstimationRequest.class;
    }

    @Override
    public Class<EstimationRequestSample> getTarget() {
        return EstimationRequestSample.class;
    }
}
