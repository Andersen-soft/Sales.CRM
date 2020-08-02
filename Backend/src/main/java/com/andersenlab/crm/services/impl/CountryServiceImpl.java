package com.andersenlab.crm.services.impl;

import com.andersenlab.crm.configuration.properties.ApplicationProperties;
import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.exceptions.CrmException;
import com.andersenlab.crm.model.entities.Country;
import com.andersenlab.crm.model.entities.QCountry;
import com.andersenlab.crm.repositories.CountryRepository;
import com.andersenlab.crm.repositories.ReportRepository;
import com.andersenlab.crm.rest.dto.RegionApiDto;
import com.andersenlab.crm.rest.response.CountryDto;
import com.andersenlab.crm.rest.response.SaleReportCountryResponse;
import com.andersenlab.crm.services.CountryService;
import com.andersenlab.crm.utils.RestClient;
import com.querydsl.core.types.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static com.andersenlab.crm.exceptions.ExceptionMessages.WRONG_COUNTRIES_MESSAGE;
import static com.andersenlab.crm.services.i18n.I18nConstants.LANGUAGE_TAG_EN;

@Service
@RequiredArgsConstructor
@Slf4j
public class CountryServiceImpl implements CountryService {
    private final ConversionService conversionService;
    private final CountryRepository countryRepository;
    private final ReportRepository reportRepository;

    private final ApplicationProperties applicationProperties;

    @Override
    @Transactional(readOnly = true)
    public List<Country> findAll() {
        return countryRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CountryDto> findAll(Predicate predicate, Pageable pageable, Locale locale) {
        return conversionService.convertToPageWithLocale(
                pageable, countryRepository.findAll(predicate, pageable), CountryDto.class, locale);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SaleReportCountryResponse> findAllBySaleReport(Predicate predicate, Pageable pageable, Locale locale) {
        List<SaleReportCountryResponse> countries = StreamSupport
                .stream(reportRepository.findAll(predicate, pageable.getSort()).spliterator(), false)
                .map(report -> SaleReportCountryResponse.builder()
                        .countryId(report.getCountryId())
                        .countryName(LANGUAGE_TAG_EN.equalsIgnoreCase(locale.getLanguage())
                                ? report.getCountryNameEn()
                                : report.getCountryName())
                        .build())
                .distinct()
                .collect(Collectors.toList());
        return new PageImpl<>(countries, pageable, countries.size());
    }

    @Override
    @Transactional(readOnly = true)
    public Country findById(Long id) {
        return Optional.ofNullable(countryRepository.findOne(id))
                .orElseThrow(() -> new EntityNotFoundException("Country not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public boolean exist(Long id) {
        return countryRepository.exists(id);
    }

    @Override
    @Transactional(readOnly = true)
    public void validateById(Long id) {
        if (!countryRepository.exists(id)) {
            throw new EntityNotFoundException("Country not found: " + id);
        }
    }

    @Override
    @Transactional
    public Set<Country> getCountriesOrThrowException(List<Long> countryIds) {
        Iterable<Country> countryIterable = countryRepository.findAll(QCountry.country.id.in(countryIds));
        Set<Country> countries = StreamSupport.stream(countryIterable.spliterator(), false).collect(Collectors.toSet());
        if (countries.isEmpty()) {
            throw new CrmException(WRONG_COUNTRIES_MESSAGE);
        }
        return countries;
    }

    @Override
    public Country getByAlpha2(String countryCode) {
        return countryRepository.findByAlpha2(countryCode);
    }

    @Override
    public Country defineByIp(String ip) {
        RestClient restClient = new RestClient();
        String regionApiUrl = applicationProperties.getRegionApiUrl();
        ResponseEntity<RegionApiDto> response = restClient.get(regionApiUrl + ip, RegionApiDto.class);

        Country country = countryRepository.findByAlpha2(response.getBody().getCountryCode());
        log.info("Defined country {} by ip {}", country, ip);
        return country;
    }
}
