package com.andersenlab.crm.converter.history;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.model.entities.ResumeRequestHistory;
import com.andersenlab.crm.rest.dto.history.HistoryDto;
import org.junit.Before;
import org.junit.Test;

import java.time.LocalDateTime;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.Mockito.mock;

public class ResumeRequestHistoryToHistoryDtoTest {

    private final ConversionService conversionService = mock(ConversionService.class);
    private ResumeRequestHistoryToHistoryDto converter;
    private ResumeRequestHistory history;

    @Before
    public void setUp() {
        converter = new ResumeRequestHistoryToHistoryDto(conversionService);
        history = getResumeRequestHistory();
    }

    @Test
    public void whenGetClassesThenReturnExpected() {
        assertEquals(converter.getSource(), ResumeRequestHistory.class);
        assertEquals(converter.getTarget(), HistoryDto.class);
    }

    @Test
    public void convert() {
        HistoryDto result = converter.convert(history);
        assertNotNull(result);
        assertEquals("ResumeRequestHistory id", history.getId(), result.getId());
        assertEquals("ResumeRequestHistory name", history.getDescription(), result.getDescription());
        assertEquals("ResumeRequestHistory status", history.getCreateDate(), result.getDate());
    }

    private ResumeRequestHistory getResumeRequestHistory() {
        ResumeRequestHistory resumeRequestHistory = new ResumeRequestHistory();
        resumeRequestHistory.setId(10L);
        resumeRequestHistory.setDescription("Выполнено действие абра кадабра тирлибом");
        resumeRequestHistory.setEmployee(new Employee(1L));
        resumeRequestHistory.setCreateDate(LocalDateTime.now());
        return resumeRequestHistory;
    }

}