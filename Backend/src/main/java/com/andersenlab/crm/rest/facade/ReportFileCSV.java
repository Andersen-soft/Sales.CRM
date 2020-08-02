package com.andersenlab.crm.rest.facade;


import com.andersenlab.crm.annotations.ReportColumn;
import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.exceptions.CrmException;
import com.andersenlab.crm.model.entities.ActivityReport;
import com.andersenlab.crm.model.view.ResumeView;
import com.andersenlab.crm.rest.dto.ResumeRequestViewDto;
import com.andersenlab.crm.rest.dto.SocialNetworkAnswerHeadDto;
import com.andersenlab.crm.rest.dto.resumerequest.ResumeProcessingReportRowDTO;
import com.andersenlab.crm.rest.request.ReportRequestFilter;
import com.andersenlab.crm.rest.response.CompanyResponseReport;
import com.andersenlab.crm.rest.response.CompanySaleReportResponse;
import com.andersenlab.crm.rest.response.ContactResponseReport;
import com.andersenlab.crm.rest.response.EstimationRequestReportResponse;
import com.andersenlab.crm.rest.response.RatingNCReportResponse;
import com.andersenlab.crm.rest.response.ResumeViewResponse;
import com.andersenlab.crm.security.AuthenticatedUser;
import com.andersenlab.crm.services.ActivityService;
import com.andersenlab.crm.services.CompanySaleReportService;
import com.andersenlab.crm.services.CompanyService;
import com.andersenlab.crm.services.ContactService;
import com.andersenlab.crm.services.EstimationRequestService;
import com.andersenlab.crm.services.ResumeRequestViewService;
import com.andersenlab.crm.services.ResumeViewService;
import com.andersenlab.crm.services.i18n.I18nService;
import com.querydsl.core.types.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.apache.commons.lang3.reflect.FieldUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.StringWriter;
import java.lang.reflect.Field;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import static com.andersenlab.crm.services.i18n.I18nConstants.LANGUAGE_TAG_EN;
import static com.andersenlab.crm.services.i18n.I18nConstants.LANGUAGE_TAG_RU;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReportFileCSV implements ReportFile {
    private final CompanySaleReportService reportService;
    private final ActivityService activityService;
    private final ResumeRequestViewFacade resumeRequestViewFacade;
    private final SocialNetworkAnswerFacade socialNetworkAnswerFacade;
    private final EstimationRequestService estimationRequestService;
    private final ResumeViewService resumeViewService;
    private final ConversionService conversionService;
    private final CompanyService companyService;
    private final ContactService contactService;
    private final AuthenticatedUser authenticatedUser;
    private final ResumeRequestViewService resumeRequestViewService;

    private final I18nService i18nService;
    private static final Locale DEFAULT_LOCALE = Locale.forLanguageTag(LANGUAGE_TAG_RU);

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("d.MM.yyyy");

    @Override
    public byte[] getReport(Predicate predicate, ReportRequestFilter filter) {
        // Use  Locale resolving for google sheets later

        Locale locale = Locale.forLanguageTag(LANGUAGE_TAG_EN);

        Pageable pageable = new PageRequest(0, Integer.MAX_VALUE, Sort.Direction.DESC, "createDate");
        List<CompanySaleReportResponse> dataSet = (conversionService.convertToPageWithLocale(
                pageable, reportService.getCompanySaleReports(predicate, pageable), CompanySaleReportResponse.class, locale))
                .getContent();

        List<String> excludedFieldNames = getExcludedFieldNames(filter);
        List<Field> annotatedFields = getAnnotatedFields(CompanySaleReportResponse.class).stream()
                .filter(f -> !excludedFieldNames.contains(f.getName()))
                .collect(Collectors.toList());

        List<String> headers = getHeaders(annotatedFields);
        List<String> fieldNames = getFieldNames(annotatedFields);
        List<String> dates = getDateFromPredicate(predicate);
        List<List<String>> dataReport = defineReportData(dataSet, fieldNames);

        StringWriter stringWriter;
        if (dates.size() == 2) {
            stringWriter = makeStringWriter(dataReport, headers, LocalDate.parse(dates.get(0)), LocalDate.parse(dates.get(1)));
        } else {
            stringWriter = makeStringWriter(dataReport, headers);
        }
        return stringWriter.toString().getBytes(StandardCharsets.UTF_8);
    }

    private List<String> getExcludedFieldNames(ReportRequestFilter filter) {
        List<Field> fields = Arrays.asList(filter.getClass().getDeclaredFields());
        return fields.stream()
                .filter(f -> {
                    try {
                        return !(Boolean) FieldUtils.readDeclaredField(filter, f.getName(), true);
                    } catch (IllegalAccessException e) {
                        log.error("Can't get value from {}", f.getName(), e);
                        return false;
                    }
                })
                .map(Field::getName)
                .collect(Collectors.toList());
    }

    @Override
    public byte[] getCompanyReport(LocalDate createDateFrom, LocalDate createDateTo) {
        List<CompanyResponseReport> dataSet = conversionService.convertToList(
                companyService.getCompaniesForReport(createDateFrom, createDateTo), CompanyResponseReport.class);
        List<Field> annotatedFields = getAnnotatedFields(CompanyResponseReport.class);
        List<String> headers = getHeaders(annotatedFields);
        List<String> fieldNames = getFieldNames(annotatedFields);
        List<List<String>> dataReport = defineReportData(dataSet, fieldNames);
        StringWriter stringWriter = makeStringWriter(dataReport, headers);
        return stringWriter.toString().getBytes(StandardCharsets.UTF_8);
    }

    @Override
    public byte[] getActivitiesReport(LocalDate creationFrom, LocalDate creationTo) {
        List<ActivityReport> dataSet = activityService.getReports(creationFrom, creationTo);
        List<Field> headerFields = Arrays.stream(ActivityReport.class.getDeclaredFields())
                .filter(field -> Optional.ofNullable(field.getAnnotation(ReportColumn.class)).isPresent())
                .collect(Collectors.toList());
        List<String> header = getHeaders(headerFields);
        List<String> headerFilter = getFieldNames(headerFields);
        List<List<String>> dataReport = defineReportData(dataSet, headerFilter);
        StringWriter stringWriter = makeStringWriter(dataReport, header, creationFrom, creationTo);
        return stringWriter.toString().getBytes(StandardCharsets.UTF_8);
    }

    @Override
    public byte[] getResumeRequestReport(Predicate predicate, Pageable pageable) {
        Pageable page = new PageRequest(0, Integer.MAX_VALUE, pageable.getSort());
        List<ResumeRequestViewDto> dataSet = resumeRequestViewFacade.get(predicate, page).getContent();
        List<Field> annotatedFields = getAnnotatedFields(ResumeRequestViewDto.class);
        List<String> headers = getHeaders(annotatedFields);
        List<String> fieldNames = getFieldNames(annotatedFields);
        List<List<String>> dataReport = defineReportData(dataSet, fieldNames);
        StringWriter stringWriter = makeStringWriter(dataReport, headers);
        return stringWriter.toString().getBytes(StandardCharsets.UTF_8);
    }

    @Override
    public byte[] getSocialAnswersReport(Predicate predicate) {
        Pageable pageable = new PageRequest(0, Integer.MAX_VALUE, Sort.Direction.DESC, "createDate");
        List<SocialNetworkAnswerHeadDto> dataSet = socialNetworkAnswerFacade.getSocialAnswersReport(predicate, pageable);
        List<Field> annotatedFields = getAnnotatedFields(SocialNetworkAnswerHeadDto.class);
        List<String> headers = getHeaders(annotatedFields);
        List<String> headerFilter = getFieldNames(annotatedFields);
        List<String> dates = getDateFromPredicate(predicate);
        List<List<String>> dataReport = defineReportData(dataSet, headerFilter);
        StringWriter stringWriter;
        if (dates.size() == 2) {
            stringWriter = makeStringWriter(dataReport, headers, LocalDate.parse(dates.get(0)), LocalDate.parse(dates.get(1)));
        } else {
            stringWriter = makeStringWriter(dataReport, headers);
        }
        return stringWriter.toString().getBytes(StandardCharsets.UTF_8);
    }

    @Override
    public byte[] getEstimationsRequestReport(Predicate predicate, Pageable pageable) {
        Pageable page = new PageRequest(0, Integer.MAX_VALUE, pageable.getSort());
        List<EstimationRequestReportResponse> dataSet = conversionService.convertToPage(
                pageable, estimationRequestService.getRequestsWithFilterForReport(predicate, page), EstimationRequestReportResponse.class)
                .getContent();
        List<Field> annotatedFields = getAnnotatedFields(EstimationRequestReportResponse.class);
        List<String> headers = getHeaders(annotatedFields);
        List<String> fieldNames = getFieldNames(annotatedFields);
        List<List<String>> reportData = defineReportData(dataSet, fieldNames);
        StringWriter stringWriter = makeStringWriter(reportData, headers);
        return stringWriter.toString().getBytes(StandardCharsets.UTF_8);
    }

    @Override
    public byte[] getResumeReport(Predicate predicate) {
        Pageable pageable = new PageRequest(0, Integer.MAX_VALUE);
        Page<ResumeView> resumeViews = resumeViewService.get(predicate, pageable);
        List<ResumeViewResponse> dataSet = conversionService.convertToList(resumeViews.getContent(), ResumeViewResponse.class);
        List<Field> headerFields = Arrays.stream(ResumeViewResponse.class.getDeclaredFields())
                .filter(field -> Optional.ofNullable(field.getAnnotation(ReportColumn.class)).isPresent())
                .collect(Collectors.toList());
        List<String> header = getHeaders(headerFields);
        List<String> headerFilter = getFieldNames(headerFields);
        List<List<String>> dataReport = defineReportData(dataSet, headerFilter);
        List<String> dates = getDateFromPredicate(predicate);
        StringWriter stringWriter;
        if (dates.size() == 2) {
            stringWriter = makeStringWriter(dataReport, header, LocalDate.parse(dates.get(0)), LocalDate.parse(dates.get(1)));
        } else {
            stringWriter = makeStringWriter(dataReport, header);
        }
        return stringWriter.toString().getBytes(StandardCharsets.UTF_8);
    }

    @Override
    public byte[] getContactReport(LocalDate createDateFrom, LocalDate createDateTo) {
        List<ContactResponseReport> dataSet = conversionService.convertToList(
                contactService.getContactsForReport(createDateFrom, createDateTo), ContactResponseReport.class);
        List<Field> annotatedFields = getAnnotatedFields(ContactResponseReport.class);
        List<String> headers = getHeaders(annotatedFields);
        List<String> fieldNames = getFieldNames(annotatedFields);
        List<List<String>> dataReport = defineReportData(dataSet, fieldNames);
        StringWriter stringWriter = makeStringWriter(dataReport, headers);
        return stringWriter.toString().getBytes(StandardCharsets.UTF_8);
    }

    @Override
    public byte[] getRatingsNCReport(LocalDate createFrom, LocalDate createTo, Sort sort) {
        List<RatingNCReportResponse> dataSet = socialNetworkAnswerFacade.getAllRatingsNCBetweenDate(createFrom, createTo, sort);
        List<Field> annotatedFields = getAnnotatedFields(RatingNCReportResponse.class);
        List<String> headers = getHeaders(annotatedFields);
        List<String> fieldNames = getFieldNames(annotatedFields);
        List<List<String>> dataReport = defineReportData(dataSet, fieldNames);
        StringWriter stringWriter = makeStringWriter(dataReport, headers, createFrom, createTo);
        return stringWriter.toString().getBytes(StandardCharsets.UTF_8);
    }

    @Override
    public byte[] getResumeProcessingReport(LocalDate createDateFrom, LocalDate createDateTo) {
        List<ResumeProcessingReportRowDTO> dataSet = resumeRequestViewService.getResumeProcessingReportRows(createDateFrom, createDateTo);
        List<Field> annotatedFields = getAnnotatedFields(ResumeProcessingReportRowDTO.class);
        List<String> headers = getHeaders(annotatedFields);
        List<String> fieldNames = getFieldNames(annotatedFields);
        List<List<String>> dataReport = defineReportData(dataSet, fieldNames);
        StringWriter writer = makeStringWriter(dataReport, headers, createDateFrom, createDateTo);
        return writer.toString().getBytes(StandardCharsets.UTF_8);
    }

    /**
     * Returns fields annotated by {@link ReportColumn} for csv report.
     *
     * @param clazz response type to be processed
     * @param <T>   any DTO object as response for csv report
     * @return field list
     */
    private <T> List<Field> getAnnotatedFields(Class<T> clazz) {
        return Arrays.stream(clazz.getDeclaredFields())
                .filter(field -> Optional.ofNullable(field.getAnnotation(ReportColumn.class)).isPresent())
                .collect(Collectors.toList());
    }

    private List<String> getFieldNames(List<Field> annotatedFields) {
        return annotatedFields.stream()
                .map(Field::getName)
                .collect(Collectors.toList());
    }

    private List<String> getHeaders(List<Field> annotatedFields) {
        return annotatedFields.stream()
                .map(field -> field.getAnnotation(ReportColumn.class).value())
                .collect(Collectors.toList());
    }

    private <T> List<List<String>> defineReportData(List<T> dataSet, List<String> fieldNames) {
        return dataSet.stream()
                .map(r -> filterData(r, fieldNames))
                .collect(Collectors.toList());
    }

    private <T> List<String> filterData(T element, List<String> fieldNames) {
        List<Field> fields = Arrays.asList(element.getClass().getDeclaredFields());
        return fields.stream()
                .filter(f -> fieldNames.contains(f.getName()))
                .map(field -> getStringValue(field, element)
                        .replaceAll("\r", "\\\r")
                        .replaceAll("\n", "\\\n")
                        .replaceAll("\r\n", "\\\r\\\n")
                )
                .collect(Collectors.toList());
    }

    private StringWriter makeStringWriter(List<List<String>> reportData, List<String> headers) {
        StringWriter stringWriter = new StringWriter();
        addReportData(reportData, headers, stringWriter);
        return stringWriter;
    }

    private StringWriter makeStringWriter(List<List<String>> dataReport, List<String> header, LocalDate creationFrom, LocalDate creationTo) {
        StringWriter stringWriter = new StringWriter();
        stringWriter.append(getDateField(creationFrom, creationTo));
        addReportData(dataReport, header, stringWriter);
        return stringWriter;
    }

    private void addReportData(List<List<String>> reportData, List<String> headers, StringWriter stringWriter) {
        try (CSVPrinter csvPrinter = new CSVPrinter(stringWriter,
                CSVFormat.DEFAULT
                        .withHeader(headers.toArray(new String[0]))
                        .withDelimiter(',')
                        .withRecordSeparator('\n')
                        .withEscape('\\'))) {

            for (List<String> line : reportData) {
                csvPrinter.printRecord(line);
            }
            csvPrinter.flush();
        } catch (IOException e) {
            throw new CrmException(e.getMessage(), e);
        }
    }

    private <T> String getStringValue(Field field, T element) {
        try {
            field.setAccessible(true);
            return i18nService.getLocalizedMessage(
                    String.valueOf(field.get(element)), DEFAULT_LOCALE);
        } catch (IllegalAccessException e) {
            log.error("Can't get value from {}", field.getName(), e);
            return "";
        } finally {
            field.setAccessible(false);
        }
    }

    private String getDateField(LocalDate creationFrom, LocalDate creationTo) {
        return creationFrom.format(FORMATTER) + " - " + creationTo.format(FORMATTER) + "\n";
    }

    private List<String> getDateFromPredicate(Predicate predicate) {
        List<String> dates = new ArrayList<>();
        if (predicate == null) {
            return dates;
        }
        Matcher matcher = Pattern.compile("\\d{4}-\\d{2}-\\d{2}")
                .matcher(predicate.toString());
        while (matcher.find()) {
            dates.add(matcher.group());
        }
        return dates;
    }
}
