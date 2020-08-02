package com.andersenlab.crm.converter.history;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.model.entities.ResumeRequestHistory;
import com.andersenlab.crm.rest.dto.EmployeeDto;
import com.andersenlab.crm.rest.dto.history.HistoryDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Locale;
import java.util.Optional;

import static com.andersenlab.crm.services.i18n.I18nConstants.LANGUAGE_TAG_EN;

@Component
@RequiredArgsConstructor
public class ResumeRequestHistoryToHistoryDto implements Converter<ResumeRequestHistory, HistoryDto> {

    private final ConversionService conversionService;

    @Override
    public HistoryDto convert(ResumeRequestHistory source) {
        HistoryDto target = new HistoryDto();
        target.setId(source.getId());
        target.setDescription(source.getDescription());
        Optional.ofNullable(source.getEmployee()).ifPresent(s -> target.setEmployee(defineEmployee(s)));
        target.setDate(source.getCreateDate());
        return target;
    }

    @Override
    public HistoryDto convertWithLocale(ResumeRequestHistory source, Locale locale) {
        HistoryDto target = convert(source);
        if (LANGUAGE_TAG_EN.equalsIgnoreCase(locale.getLanguage())) {
            Optional.ofNullable(source.getDescriptionEn()).ifPresent(target::setDescription);
        }

        return target;
    }

    @Override
    public Class<ResumeRequestHistory> getSource() {
        return ResumeRequestHistory.class;
    }

    @Override
    public Class<HistoryDto> getTarget() {
        return HistoryDto.class;
    }

    private EmployeeDto defineEmployee(Employee source) {
        return conversionService.convert(source, EmployeeDto.class);
    }
}