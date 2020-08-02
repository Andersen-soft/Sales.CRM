package com.andersenlab.crm.calculation;

import com.andersenlab.crm.model.entities.EstimationRequest;
import com.andersenlab.crm.model.entities.File;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.List;
import java.util.stream.Stream;

import static java.util.Optional.ofNullable;

@Component
public class EstimationRequestCalculator {

    public Long getSaleObjects(EstimationRequest source) {
        List<File> estimations = source.getEstimations();
        return ofNullable(estimations).map(Collection::stream).map(Stream::count).orElse(0L);
    }

}
