package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.entities.EstimationRequest;
import com.andersenlab.crm.rest.request.EstimationRequestCreate;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Optional;

/**
 * @author Yevhenii Pshenychnyi
 */
@Component
public class EstimationRequestCreateToEstimationRequestConverter
        implements Converter<EstimationRequestCreate, EstimationRequest> {

    @Override
    public EstimationRequest convert(EstimationRequestCreate source) {
        EstimationRequest target = new EstimationRequest();
        target.setName(source.getName());
        Optional.ofNullable(source.getDeadline()).ifPresent(date -> target.setDeadline(LocalDateTime.of(source.getDeadline(), LocalTime.MIN)));
        target.setComments(new ArrayList<>());
        return target;
    }

    @Override
    public Class<EstimationRequestCreate> getSource() {
        return EstimationRequestCreate.class;
    }

    @Override
    public Class<EstimationRequest> getTarget() {
        return EstimationRequest.class;
    }
}
