package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.model.entities.CompanySaleHistory;
import org.springframework.stereotype.Component;

@Component
public class CompanySaleHistoryToSampleConverter extends HistoryToHistorySampleConverter<CompanySaleHistory> {

    public CompanySaleHistoryToSampleConverter(ConversionService conversionService) {
        super(conversionService);
    }

    @Override
    public Class<CompanySaleHistory> getSource() {
        return CompanySaleHistory.class;
    }
}
