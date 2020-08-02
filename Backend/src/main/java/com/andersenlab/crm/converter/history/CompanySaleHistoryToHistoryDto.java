package com.andersenlab.crm.converter.history;

import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.entities.CompanySaleHistory;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.rest.dto.EmployeeDto;
import com.andersenlab.crm.rest.dto.history.HistoryDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Locale;

import static com.andersenlab.crm.services.i18n.I18nConstants.LANGUAGE_TAG_EN;
import static org.apache.cxf.common.util.StringUtils.isEmpty;

@Component
@RequiredArgsConstructor
public class CompanySaleHistoryToHistoryDto implements Converter<CompanySaleHistory, HistoryDto> {
    private final Converter<Employee, EmployeeDto> employeeDtoConverter;

    @Override
    public HistoryDto convert(CompanySaleHistory source) {
        HistoryDto target = new HistoryDto();
        target.setId(source.getId());
        target.setDescription(source.getDescription());
        target.setDate(source.getCreateDate());
        target.setEmployee(employeeDtoConverter.convert(source.getEmployee()));

        return target;
    }

    @Override
    public HistoryDto convertWithLocale(CompanySaleHistory source, Locale locale) {
        HistoryDto target = convert(source);
        if (!isEmpty(source.getDescriptionEn()) && LANGUAGE_TAG_EN.equalsIgnoreCase(locale.getLanguage())) {
            target.setDescription(source.getDescriptionEn());
        }
        return target;
    }

    @Override
    public Class<CompanySaleHistory> getSource() {
        return CompanySaleHistory.class;
    }

    @Override
    public Class<HistoryDto> getTarget() {
        return HistoryDto.class;
    }
}
