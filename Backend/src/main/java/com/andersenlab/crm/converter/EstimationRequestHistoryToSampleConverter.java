package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.model.entities.EstimationRequestHistory;
import org.springframework.stereotype.Component;

@Component
public class EstimationRequestHistoryToSampleConverter extends HistoryToHistorySampleConverter<EstimationRequestHistory> {

    public EstimationRequestHistoryToSampleConverter(ConversionService conversionService) {
        super(conversionService);
    }

    @Override
    public Class<EstimationRequestHistory> getSource() {
        return EstimationRequestHistory.class;
    }
}
