package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.model.entities.ResumeRequestHistory;
import org.springframework.stereotype.Component;

@Component
public class ResumeRequestHistoryToSampleConverter extends HistoryToHistorySampleConverter<ResumeRequestHistory> {

    public ResumeRequestHistoryToSampleConverter(ConversionService conversionService) {
        super(conversionService);
    }

    @Override
    public Class<ResumeRequestHistory> getSource() {
        return ResumeRequestHistory.class;
    }
}
