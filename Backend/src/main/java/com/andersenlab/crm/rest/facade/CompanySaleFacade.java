package com.andersenlab.crm.rest.facade;

import com.andersenlab.crm.rest.dto.MailImportSaleRequest;
import com.andersenlab.crm.rest.dto.MailImportSaleResponse;
import com.andersenlab.crm.rest.request.CompanySaleCreateRequest;
import com.andersenlab.crm.rest.request.CompanySaleUpdateRequest;
import com.andersenlab.crm.rest.request.ExpressSaleCreateRequest;
import com.andersenlab.crm.rest.request.SiteCreateDto;
import com.andersenlab.crm.rest.response.CompanySaleResponse;
import com.andersenlab.crm.rest.response.ExpressSaleResponse;
import com.querydsl.core.types.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CompanySaleFacade {
    Page<CompanySaleResponse> getCompanySales(Predicate predicate, Pageable pageable);

    List<String> getCategories();

    Long createCompanySale(CompanySaleCreateRequest request);

    void updateCompanySale(long id, CompanySaleUpdateRequest request);

    Long importCompanySaleFromSite(SiteCreateDto request);

    ExpressSaleResponse createExpressSale(ExpressSaleCreateRequest request);

    ExpressSaleResponse createExpressSaleByMail(ExpressSaleCreateRequest request);

    MailImportSaleResponse importCompanySaleFromMail(MailImportSaleRequest request);
}
