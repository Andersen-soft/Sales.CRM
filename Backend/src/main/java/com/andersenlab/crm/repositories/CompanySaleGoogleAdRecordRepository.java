package com.andersenlab.crm.repositories;

import com.andersenlab.crm.model.entities.CompanySaleGoogleAdRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface CompanySaleGoogleAdRecordRepository extends JpaRepository<CompanySaleGoogleAdRecord, Long> {
    CompanySaleGoogleAdRecord findByCompanySaleId(long id);

    List<CompanySaleGoogleAdRecord> findAllByConversionDateBeforeAndRecordExportedFalse(LocalDateTime specifiedDate);
}
