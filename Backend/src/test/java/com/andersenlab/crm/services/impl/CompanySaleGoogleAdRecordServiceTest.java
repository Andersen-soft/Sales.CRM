package com.andersenlab.crm.services.impl;

import com.andersenlab.crm.configuration.properties.ApplicationProperties;
import com.andersenlab.crm.model.entities.CompanySale;
import com.andersenlab.crm.model.entities.CompanySaleGoogleAdRecord;
import com.andersenlab.crm.repositories.CompanySaleGoogleAdRecordRepository;
import com.andersenlab.crm.services.CompanySaleGoogleAdRecordService;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Arrays;

import static org.mockito.Matchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class CompanySaleGoogleAdRecordServiceTest {
    private static final String EXAMPLE_GCLID = "example-id";

    private final CompanySaleGoogleAdRecordRepository googleAdRecordRepository = mock(CompanySaleGoogleAdRecordRepository.class);
    private final ApplicationProperties applicationProperties = mock(ApplicationProperties.class);

    private CompanySale companySale;
    private CompanySaleGoogleAdRecord recordWithoutConversionTime;
    private CompanySaleGoogleAdRecord recordWithConversionTime;
    private CompanySaleGoogleAdRecord recordThatWasExported;

    private CompanySaleGoogleAdRecordService googleAdRecordService = new CompanySaleGoogleAdRecordServiceImpl(
            googleAdRecordRepository,
            applicationProperties
    );

    @Before
    public void setUpEntities() {
        when(googleAdRecordRepository.save(any(CompanySaleGoogleAdRecord.class)))
                .thenAnswer(a -> a.getArguments()[0]);
        when(applicationProperties.getTimezone())
                .thenReturn(ZoneId.systemDefault().toString());

        companySale = new CompanySale();
        companySale.setId(1L);

        recordWithoutConversionTime = new CompanySaleGoogleAdRecord();
        recordWithoutConversionTime.setCompanySale(companySale);
        recordWithoutConversionTime.setGoogleClickId(EXAMPLE_GCLID);

        recordWithConversionTime = new CompanySaleGoogleAdRecord();
        recordWithConversionTime.setCompanySale(companySale);
        recordWithConversionTime.setGoogleClickId(EXAMPLE_GCLID);
        recordWithConversionTime.setConversionName("Contract");
        recordWithConversionTime.setConversionDate(LocalDateTime.now().minusDays(1));

        recordThatWasExported = new CompanySaleGoogleAdRecord();
        recordThatWasExported.setCompanySale(companySale);
        recordThatWasExported.setGoogleClickId(EXAMPLE_GCLID);
        recordThatWasExported.setConversionName("Contract");
        recordThatWasExported.setConversionDate(LocalDateTime.now().minusDays(1));
        recordThatWasExported.setRecordExported(true);

        when(googleAdRecordRepository.findByCompanySaleId(1L))
                .thenReturn(recordWithoutConversionTime);
        when(googleAdRecordRepository.findAllByConversionDateBeforeAndRecordExportedFalse(any(LocalDateTime.class)))
                .thenReturn(Arrays.asList(recordWithConversionTime));
    }

    @Test
    public void whenCreateGoogleAdRecordThenSuccess() {
        CompanySaleGoogleAdRecord expected = new CompanySaleGoogleAdRecord();
        expected.setCompanySale(companySale);
        expected.setGoogleClickId(EXAMPLE_GCLID);

        CompanySaleGoogleAdRecord actual = googleAdRecordService.create(expected);
        Assert.assertEquals(expected, actual);
    }

    @Test
    public void whenUpdateGoogleAdRecordBySaleStatusChangedThenSuccess() {
        companySale.setStatus(CompanySale.Status.OPPORTUNITY);

        CompanySaleGoogleAdRecord expected = new CompanySaleGoogleAdRecord();
        expected.setCompanySale(companySale);
        expected.setGoogleClickId(EXAMPLE_GCLID);
        expected.setConversionName("Opportunity");

        googleAdRecordService.updateRecordOnSaleStatusChanged(companySale);
        expected.setConversionDate(recordWithoutConversionTime.getConversionDate());

        Assert.assertEquals(expected, recordWithoutConversionTime);
        Assert.assertNotNull(recordWithoutConversionTime.getConversionDate());
    }

    @Test
    public void whenBuildGoogleAdRecordThenSuccess() {
        CompanySaleGoogleAdRecord expected = new CompanySaleGoogleAdRecord();
        expected.setCompanySale(companySale);
        expected.setGoogleClickId(EXAMPLE_GCLID);

        CompanySaleGoogleAdRecord actual = googleAdRecordService.buildByCompanySale(
                companySale,
                EXAMPLE_GCLID,
                null,
                null,
                null
        );

        Assert.assertEquals(expected, actual);
    }

    @Test
    public void whenExportRecordsThenSetRecordExportedTrue() {
        googleAdRecordService.exportRecordsToCSVFile();
        Assert.assertTrue(recordThatWasExported.isRecordExported());
    }
}
