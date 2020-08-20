package com.andersenlab.crm.services.impl;

import com.andersenlab.crm.exceptions.CrmException;
import com.andersenlab.crm.exceptions.ResourceNotFoundException;
import com.andersenlab.crm.model.entities.Source;
import com.andersenlab.crm.repositories.ReportRepository;
import com.andersenlab.crm.repositories.SourceRepository;
import com.andersenlab.crm.rest.request.SourceUpdateRequest;
import com.andersenlab.crm.rest.response.SaleReportSourceResponse;
import com.andersenlab.crm.services.SourceService;
import com.querydsl.core.types.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static com.andersenlab.crm.services.i18n.I18nConstants.LANGUAGE_TAG_EN;
import static com.andersenlab.crm.utils.ServiceUtils.isRusWord;

@Service
@RequiredArgsConstructor
public class SourceServiceImpl implements SourceService {
    private static final String SOCIAL_NETWORK_DESCRIPTION_RU = "Соц. сеть";
    private static final String SOCIAL_NETWORK_DESCRIPTION_EN = "Social network";

    private final SourceRepository sourceRepository;
    private final ReportRepository reportRepository;

    @Override
    public Source createSource(Source request) {
        try {
            if (Source.Type.SOCIAL_NETWORK.equals(request.getType())) {
                request.setDescriptionRu(SOCIAL_NETWORK_DESCRIPTION_RU);
                request.setDescriptionEn(SOCIAL_NETWORK_DESCRIPTION_EN);
            }
            return sourceRepository.save(request);
        } catch (DataIntegrityViolationException e) {
            throw new CrmException(e.getMostSpecificCause().getMessage(), e);
        }
    }

    @Override
    public void updateSource(Long id, SourceUpdateRequest update) {
        Source toolToUpdate = getSourceByIdOrThrowException(id);
        Optional.ofNullable(update.getName())
                .ifPresent(toolToUpdate::setName);
        sourceRepository.saveAndFlush(toolToUpdate);
    }

    @Override
    public List<Source> findAll(Predicate predicate) {
        return (List<Source>) sourceRepository.findAll(predicate);
    }

    @Override
    public void validateSourceType(Long id, Source.Type type) {
        Source source = getSourceByIdOrThrowException(id);
        if (!source.getType().equals(type)) {
            throw new IllegalArgumentException(String.format("Роль '%s' не соответствует", type.getName()));
        }
    }

    private Source getSourceByIdOrThrowException(Long id) {
        return Optional.ofNullable(sourceRepository.getOne(id))
                .orElseThrow(() -> new ResourceNotFoundException("Source not found"));
    }

    @Override
    public Page<Source> findAll(Predicate predicate, Pageable pageable) {
        return sourceRepository.findAll(predicate, pageable);
    }

    @Override
    public Source findOneOrThrow(Long id) {
        return Optional.ofNullable(
                sourceRepository.findOne(id)).orElseThrow(() -> new CrmException("Источник не найден"));
    }

    @Override
    public Page<Source> getSourcesWithFilter(Predicate predicate, Pageable pageable) {
        Page<Source> all = sourceRepository.findAll(predicate, pageable);
        List<Source> sources = all.getContent();
        List<Source> rus = new ArrayList<>();
        List<Source> eng = new ArrayList<>();
        List<Source> sortedByLanguages = new LinkedList<>();


        for (Source s : sources) {
            if (isRusWord(s.getName())) {
                rus.add(s);
            } else {
                eng.add(s);
            }
        }

        rus.sort(Comparator.comparing(Source::getName));
        eng.sort(Comparator.comparing(Source::getName));
        sortedByLanguages.addAll(rus);
        sortedByLanguages.addAll(eng);

        return new PageImpl<>(sortedByLanguages, pageable, sortedByLanguages.size());
    }

    @Override
    public Page<SaleReportSourceResponse> getReportSources(Predicate predicate, Pageable pageable, Locale locale) {
        List<SaleReportSourceResponse> statuses = StreamSupport
                .stream(reportRepository.findAll(predicate, pageable.getSort()).spliterator(), false)
                .map(report -> SaleReportSourceResponse.builder()
                        .sourceId(report.getSourceId())
                        .sourceName(LANGUAGE_TAG_EN.equalsIgnoreCase(locale.getLanguage())
                                ? report.getSourceNameEn()
                                : report.getSourceName())
                        .description(LANGUAGE_TAG_EN.equalsIgnoreCase(locale.getLanguage())
                                ? report.getSourceDescriptionEn()
                                : report.getSourceDescriptionRu())
                        .build())
                .distinct()
                .collect(Collectors.toList());
        return new PageImpl<>(statuses, pageable, statuses.size());
    }
}
