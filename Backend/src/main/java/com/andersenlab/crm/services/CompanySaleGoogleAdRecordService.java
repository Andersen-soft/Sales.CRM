package com.andersenlab.crm.services;

import com.andersenlab.crm.model.entities.CompanySale;
import com.andersenlab.crm.model.entities.CompanySaleGoogleAdRecord;

/**
 * Service interface containing methods related to CompanySaleGoogleAdRecord entity.
 */
public interface CompanySaleGoogleAdRecordService {
    CompanySaleGoogleAdRecord create(CompanySaleGoogleAdRecord record);

    void updateRecordOnSaleStatusChanged(CompanySale companySale);

    byte[] exportRecordsToCSVFile();

    CompanySaleGoogleAdRecord buildByCompanySale(
            CompanySale companySale,
            String gclid,
            String firstPoint,
            String lastPoint,
            String sessionPoint
    );
}
