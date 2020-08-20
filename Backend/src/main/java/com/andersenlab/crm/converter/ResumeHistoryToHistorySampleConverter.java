package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.model.entities.ResumeHistory;
import org.springframework.stereotype.Component;

@Component
public class ResumeHistoryToHistorySampleConverter extends HistoryToHistorySampleConverter<ResumeHistory> {

    public ResumeHistoryToHistorySampleConverter(ConversionService conversionService) {
        super(conversionService);
    }

    @Override
    public Class<ResumeHistory> getSource() {
        return ResumeHistory.class;
    }
}
