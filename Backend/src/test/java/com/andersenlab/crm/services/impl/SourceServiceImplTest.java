package com.andersenlab.crm.services.impl;

import com.andersenlab.crm.model.entities.QSource;
import com.andersenlab.crm.model.entities.Source;
import com.andersenlab.crm.repositories.ReportRepository;
import com.andersenlab.crm.repositories.SourceRepository;
import com.andersenlab.crm.services.SourceService;
import com.querydsl.core.types.Predicate;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import java.util.ArrayList;
import java.util.List;

public class SourceServiceImplTest {

    private SourceService sourceService;
    private SourceRepository sourceRepository;
    private ReportRepository reportRepository;

    @Before
    public void setup() {
        sourceRepository = mock(SourceRepository.class);
        sourceService = new SourceServiceImpl(sourceRepository, reportRepository);
    }

    @Test
    public void findAll() {
        Predicate predicate = QSource.source.type.eq(Source.Type.SOCIAL_NETWORK);
        List<Source> sources = new ArrayList<>();
        when(sourceRepository.findAll(any(Predicate.class))).thenReturn(sources);
        List<Source> result = sourceService.findAll(predicate);
        verify(sourceRepository, times(1)).findAll(predicate);
        assertEquals(sources, result);
    }
}