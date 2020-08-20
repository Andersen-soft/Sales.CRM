package com.andersenlab.crm.converter;

import com.andersenlab.crm.calculation.ResumeRequestCalculator;
import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.model.entities.ResumeRequest;
import com.andersenlab.crm.rest.sample.SaleRequestSample;
import org.springframework.stereotype.Component;

import static com.andersenlab.crm.utils.ConverterHelper.getNullable;

@Component
public class ResumeRequestToSaleRequestSampleConverter extends SaleRequestToSaleRequestSampleConverter<ResumeRequest> {

    private static final String RESUME = "Резюме";

    private final ResumeRequestCalculator requestCalculator;

    public ResumeRequestToSaleRequestSampleConverter(ConversionService conversionService, ResumeRequestCalculator requestCalculator) {
        super(conversionService);
        this.requestCalculator = requestCalculator;
    }

    @Override
    public SaleRequestSample convert(ResumeRequest source) {
        SaleRequestSample target = new SaleRequestSample();
        super.setGenericFields(source, target);
        target.setStatus(getNullable(source.getStatus(), ResumeRequest.Status::getName));
        target.setType(RESUME);
        target.setDescription(source.getName());
        target.setSaleObjects(requestCalculator.getSaleObjects(source));
        return target;
    }

    @Override
    public Class<ResumeRequest> getSource() {
        return ResumeRequest.class;
    }
}
