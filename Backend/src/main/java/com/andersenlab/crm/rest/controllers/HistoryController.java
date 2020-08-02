package com.andersenlab.crm.rest.controllers;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.rest.BaseResponse;
import com.andersenlab.crm.rest.sample.HistorySample;
import com.andersenlab.crm.services.HistoryService;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Locale;

@RestController
@RequiredArgsConstructor
@RequestMapping("/history")
public class HistoryController extends BaseController {

    private final HistoryService historyService;
    private final ConversionService conversionService;

    @GetMapping("/estimation_request")
    @ApiOperation(value = "Получение уникальных значений для фильтра по запросам на оценку",
            notes = "id - (обязательное поле) id запроса на оценку(прим.id=5)\n" +
                    "Задание параметров отображения результата:\n page - номер страницы результатов (прим. page=9)\n" +
                    "size - количество записей на странице (прим. size=13)\n sort - сортировка (прим. sort=id,desc)")
    public BaseResponse<Page<HistorySample>> getEstimationRequestHistory(
            @RequestParam Long id,
            Pageable pageable,
            Locale locale) {
        return new BaseResponse<>(conversionService.convertToPageWithLocale(
                pageable, historyService.getEstimationRequestHistory(id, pageable), HistorySample.class, locale));
    }

    @GetMapping("/resume_request")
    @ApiOperation(value = "Получение уникальных значений для фильтра по запросам на резюме",
            notes = "id - (обязательное поле) id запроса на резюме(прим.id=260)")
    public BaseResponse<List<HistorySample>> getResumeRequestHistory(
            @RequestParam Long id, Locale locale) {
        return new BaseResponse<>(conversionService.convertToListWithLocale(
                historyService.getResumeRequestHistory(id), HistorySample.class, locale));
    }

    @GetMapping("/company_sale")
    @ApiOperation(value = "Получение уникальных значений для фильтра по продажам компаний",
            notes = "id - (обязательное поле) id продажи(прим.id=44050)")
    public BaseResponse<List<HistorySample>> getCompanySaleHistory(@RequestParam Long id) {
        return new BaseResponse<>(conversionService.convertToList(
                historyService.getCompanySaleHistory(id), HistorySample.class));
    }
}
