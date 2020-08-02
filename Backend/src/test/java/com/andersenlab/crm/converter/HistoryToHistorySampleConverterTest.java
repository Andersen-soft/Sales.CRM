package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.model.entities.History;
import com.andersenlab.crm.rest.sample.EmployeeSample;
import com.andersenlab.crm.rest.sample.HistorySample;
import org.junit.Test;

import java.time.LocalDateTime;

import static org.junit.Assert.assertEquals;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

public class HistoryToHistorySampleConverterTest {

    private final ConversionService conversionService = mock(ConversionService.class);
    private final HistoryToHistorySampleConverter<History> converter = new HistoryToHistorySampleConverter<History>(conversionService) {
        @Override
        public Class<History> getSource() {
            return null;
        }
    };

    @Test
    public void whenConvertConvertedFieldsSet() {
        Long id = 1L;
        Employee employee = new Employee();
        String description = "test description";
        EmployeeSample employeeSample = new EmployeeSample();
        LocalDateTime createDate = LocalDateTime.of(2018, 9, 13, 12, 12, 12);

        History sample = new History();
        sample.setId(id);
        sample.setEmployee(employee);
        sample.setCreateDate(createDate);
        sample.setDescription(description);

        given(conversionService.convert(employee, EmployeeSample.class))
                .willReturn(employeeSample);

        HistorySample result = converter.convert(sample);

        assertEquals(id, result.getId());
        assertEquals(employeeSample, result.getEmployee());
        assertEquals(description, result.getDescription());
        assertEquals(createDate, result.getCreateDate());

        verify(conversionService, times(1))
                .convert(employee, EmployeeSample.class);
    }

    @Test
    public void whenGetTargetThenReturnExpectedTargetClass() {
        assertEquals(HistorySample.class, converter.getTarget());
    }
}