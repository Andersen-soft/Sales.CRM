package com.andersenlab.crm.services;

import com.andersenlab.crm.model.entities.Source;
import com.andersenlab.crm.rest.request.SourceUpdateRequest;
import com.andersenlab.crm.rest.response.SaleReportSourceResponse;
import com.querydsl.core.types.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Locale;

public interface SourceService {
    Source createSource(Source request);

    Source findOneOrThrow(Long id);

    void updateSource(Long id, SourceUpdateRequest request);

    List<Source> findAll(Predicate predicate);

    Page<Source> findAll(Predicate predicate, Pageable pageable);

    void validateSourceType(Long id, Source.Type socialNetwork);

    Page<SaleReportSourceResponse> getReportSources(Predicate predicate, Pageable pageable, Locale locale);

    Page<Source> getSourcesWithFilter(Predicate predicate, Pageable pageable);
}
