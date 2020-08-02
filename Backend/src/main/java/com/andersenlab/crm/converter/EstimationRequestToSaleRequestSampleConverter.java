package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.model.entities.EstimationRequest;
import com.andersenlab.crm.rest.sample.SaleRequestSample;
import org.springframework.stereotype.Component;

import static com.andersenlab.crm.utils.ConverterHelper.getNullable;

@Component
public class EstimationRequestToSaleRequestSampleConverter extends SaleRequestToSaleRequestSampleConverter<EstimationRequest> {

    private static final String ESTIMATION = "Оценка";

    public EstimationRequestToSaleRequestSampleConverter(ConversionService conversionService) {
        super(conversionService);
    }

    @Override
    public SaleRequestSample convert(EstimationRequest source) {
        SaleRequestSample target = new SaleRequestSample();
        super.setGenericFields(source, target);
        target.setStatus(getNullable(source.getStatus(), EstimationRequest.Status::getName));
        target.setType(ESTIMATION);
        target.setDescription(source.getName());
        return target;
    }

    @Override
    public Class<EstimationRequest> getSource() {
        return EstimationRequest.class;
    }
}
