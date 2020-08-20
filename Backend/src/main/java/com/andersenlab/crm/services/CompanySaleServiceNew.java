package com.andersenlab.crm.services;

import com.andersenlab.crm.model.entities.CompanySale;
import com.andersenlab.crm.rest.dto.history.HistoryDto;
import com.andersenlab.crm.rest.response.CompanySaleResponse;
import com.querydsl.core.types.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Map;

public interface CompanySaleServiceNew {
    CompanySale findById(long id);

    List<CompanySale> findPreviousCompanySalesByContactEmailOrPhone(
            LocalDateTime lookup, String email, String phone);

    CompanySale createSale(CompanySale sale);

    CompanySale updateSaleById(long id, CompanySale updatedSale);

    CompanySale findCompanySaleByIdOrThrowException(Long id);

    CompanySaleResponse getCompanySaleResponseById(Long id);

    List<HistoryDto> getCompanySaleHistoryById(Long id, Locale locale);

    List<String> getStatuses();

    void deleteCompanySale(Long id);

    Long getCompanySalesWithPastActivitiesCount();

    Map<String, String> getSalesCountByStatuses();

    Page<CompanySale> getCompanySales(Predicate predicate, Pageable pageable);
}
