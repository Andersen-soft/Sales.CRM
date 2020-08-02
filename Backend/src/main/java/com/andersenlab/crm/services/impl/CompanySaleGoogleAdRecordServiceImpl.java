package com.andersenlab.crm.services.impl;

import com.andersenlab.crm.configuration.properties.ApplicationProperties;
import com.andersenlab.crm.exceptions.CrmException;
import com.andersenlab.crm.model.entities.CompanySale;
import com.andersenlab.crm.model.entities.CompanySaleGoogleAdRecord;
import com.andersenlab.crm.repositories.CompanySaleGoogleAdRecordRepository;
import com.andersenlab.crm.services.CompanySaleGoogleAdRecordService;
import lombok.RequiredArgsConstructor;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.io.StringWriter;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Base implementation of CompanySaleGoogleAdRecordService.
 */
@Service
@RequiredArgsConstructor
public class CompanySaleGoogleAdRecordServiceImpl implements CompanySaleGoogleAdRecordService {
    private static final String CONVERSION_NAME_OPPORTUNITY = "Opportunity";
    private static final String CONVERSION_NAME_CONTRACT = "Contract";

    private static final String CSV_TIMEZONE_TEMPLATE = "Parameters:TimeZone=%s,,,,\n";

    private final CompanySaleGoogleAdRecordRepository googleAdRecordRepository;
    private final ApplicationProperties applicationProperties;

    @Override
    @Transactional
    public CompanySaleGoogleAdRecord create(CompanySaleGoogleAdRecord record) {
        return googleAdRecordRepository.save(record);
    }

    @Override
    @Transactional
    public void updateRecordOnSaleStatusChanged(CompanySale companySale) {
        CompanySaleGoogleAdRecord record = googleAdRecordRepository.findByCompanySaleId(companySale.getId());
        if (record != null) {
            record.setConversionName(getConversionNameBySaleStatus(companySale.getStatus()));
            record.setConversionDate(LocalDateTime.now());
        }
    }

    @Override
    @Transactional
    public byte[] exportRecordsToCSVFile() {
        LocalDateTime currentTime = LocalDateTime.now();
        List<CompanySaleGoogleAdRecord> records =
                googleAdRecordRepository.findAllByConversionDateBeforeAndRecordExportedFalse(currentTime);

        List<List<String>> dataSet = defineRecordsCSVDataSet(records);
        List<String> headers = Arrays.asList(
                "Google Click ID",
                "Conversion Name",
                "Conversion Time",
                "Conversion Value",
                "Conversion Currency"
        );
        String csvContent = defineCsvContent(headers, dataSet);

        records.forEach(record -> record.setRecordExported(true));
        return csvContent.getBytes(StandardCharsets.UTF_8);
    }

    private List<List<String>> defineRecordsCSVDataSet(List<CompanySaleGoogleAdRecord> records) {
        List<List<String>> dataSet = new ArrayList<>();
        records.forEach(record -> {
            List<String> row = Arrays.asList(
                    record.getGoogleClickId(),
                    record.getConversionName(),
                    record.getConversionDate().toString(),
                    // Conversion value: is never specified
                    "",
                    // Conversion currency: is never specified
                    ""
            );
            dataSet.add(row);
        });

        return dataSet;
    }

    private String defineCsvContent(List<String> headers, List<List<String>> dataSet) {
        StringWriter stringWriter = new StringWriter();

        stringWriter.append(String.format(CSV_TIMEZONE_TEMPLATE,
                ZoneId.of(applicationProperties.getTimezone()).normalized().toString()));

        try (CSVPrinter printer = new CSVPrinter(
                stringWriter,
                CSVFormat.DEFAULT
                        .withHeader(headers.toArray(new String[0]))
                        .withDelimiter(',')
                        .withRecordSeparator('\n')
                        .withEscape('\\')
        )) {
            for (List<String> line : dataSet) {
                printer.printRecord(line);
            }
            printer.flush();
        } catch (IOException e) {
            throw new CrmException(e.getMessage(), e);
        }

        return stringWriter.toString();
    }

    @Override
    public CompanySaleGoogleAdRecord buildByCompanySale(
            CompanySale companySale,
            String gclid,
            String firstPoint,
            String lastPoint,
            String sessionPoint
    ) {
        CompanySaleGoogleAdRecord record = new CompanySaleGoogleAdRecord();
        record.setCompanySale(companySale);
        record.setGoogleClickId(gclid);
        record.setSiteFirstPoint(firstPoint);
        record.setSiteLastPoint(lastPoint);
        record.setSiteSessionPoint(sessionPoint);

        record.setRecordExported(false);
        return record;
    }

    private String getConversionNameBySaleStatus(CompanySale.Status status) {
        String conversionName;
        switch (status) {
            case OPPORTUNITY:
                conversionName = CONVERSION_NAME_OPPORTUNITY;
                break;
            case CONTRACT:
                conversionName = CONVERSION_NAME_CONTRACT;
                break;
            default:
                conversionName = "";
                break;
        }

        return conversionName;
    }
}
