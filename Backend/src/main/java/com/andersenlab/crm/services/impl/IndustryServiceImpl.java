package com.andersenlab.crm.services.impl;

import com.andersenlab.crm.model.entities.Industry;
import com.andersenlab.crm.repositories.IndustryRepository;
import com.andersenlab.crm.repositories.ReportRepository;
import com.andersenlab.crm.rest.response.SaleReportIndustryResponse;
import com.andersenlab.crm.services.IndustryService;
import com.querydsl.core.types.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

@Service
@RequiredArgsConstructor
@Slf4j
public class IndustryServiceImpl implements IndustryService {
    private final IndustryRepository industryRepository;
    private final ReportRepository reportRepository;

    public List<Industry> getAllIndustries() {
        return industryRepository.findAll(sortByCommonAsc());
    }

    private Sort sortByCommonAsc() {
        List<Sort.Order> orders = Arrays.asList(
                new Sort.Order(Sort.Direction.DESC, "common"),
                new Sort.Order(Sort.Direction.ASC, "name")
        );
        return new Sort(orders);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SaleReportIndustryResponse> findAllBySaleReport(Predicate predicate, Pageable pageable) {
        List<SaleReportIndustryResponse> industries = StreamSupport
                .stream(reportRepository.findAll(predicate, pageable.getSort()).spliterator(), false)
                .flatMap(report -> {
                    if (report.getCompanyIndustries() != null) {
                        return Arrays.stream(report.getCompanyIndustries().split("#=#"));
                    } else {
                        return Stream.of();
                    }
                })
                .map(name -> SaleReportIndustryResponse.builder()
                        .industryName(name)
                        .build())
                .distinct()
                .collect(Collectors.toList());
        return new PageImpl<>(industries, pageable, industries.size());
    }
}