package com.andersenlab.crm.utils;

import com.andersenlab.crm.model.entities.SaleRequestType;
import com.andersenlab.crm.rest.response.SaleRequestDto;
import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableMap;
import org.junit.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static org.apache.commons.lang3.StringUtils.EMPTY;
import static org.apache.commons.lang3.StringUtils.SPACE;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class CrmReportUtilsTest {
    private static final String DELIMITER_FOR_SALE_REPORT = "#=#";

    @Test
    public void parseWhenNullRequests() {
        final SaleRequestType type = SaleRequestType.RESUME;
        final List<SaleRequestDto> saleRequests = CrmReportUtils.parseRequests(null, type);
        assertTrue(saleRequests.isEmpty());
    }

    @Test
    public void parseWhenEmptyRequests() {
        final SaleRequestType type = SaleRequestType.RESUME;
        final List<SaleRequestDto> saleRequests = CrmReportUtils.parseRequests(EMPTY, type);
        assertTrue(saleRequests.isEmpty());
    }

    @Test
    public void parseWhenValidSingleRequest() {
        final SaleRequestType type = SaleRequestType.ESTIMATION;
        final String source = "3916 оценка1";
        final String[] request = source.split(DELIMITER_FOR_SALE_REPORT);
        final List<SaleRequestDto> expectedList = ImmutableList.of(new SaleRequestDto(request[0].split(SPACE), type));
        final List<SaleRequestDto> resultList = CrmReportUtils.parseRequests(source, type);
        assertEquals(expectedList.size(), resultList.size());
    }

    @Test
    public void parseWhenValidRequests() {
        final SaleRequestType type = SaleRequestType.ESTIMATION;
        final String source = "3916 оценка1#=#3917 оценка с длинным названием";
        final String[] requests = source.split(DELIMITER_FOR_SALE_REPORT);
        final List<SaleRequestDto> expectedList = ImmutableList.of(
                new SaleRequestDto(requests[0].split(SPACE), type),
                new SaleRequestDto(requests[1].split(SPACE), type)
        );
        final List<SaleRequestDto> resultList = CrmReportUtils.parseRequests(source, type);
        assertEquals(expectedList.size(), resultList.size());
    }

    @Test
    public void concatWhenNullIds() {
        assertTrue(CrmReportUtils.concatSales(null).isEmpty());
    }

    @Test
    public void concatWhenEmptyIds() {
        final List<String> source = new ArrayList<>();
        final String result = CrmReportUtils.concatSales(source);
        assertEquals(EMPTY, result);
    }

    @Test
    public void concatWhenValidIds() {
        final List<String> source = ImmutableList.of("1", "2", "3");
        final String result = CrmReportUtils.concatSales(source);
        source.forEach(id -> assertTrue(result.contains(id)));
    }

    @Test
    public void salesByStatusWhenNullResultSet() {
        assertTrue(CrmReportUtils.getSalesByStatus(null).isEmpty());
    }

    @Test
    public void salesByStatusWhenEmptyResultSet() {
        assertTrue(CrmReportUtils.getSalesByStatus(EMPTY).isEmpty());
    }

    @Test
    public void salesByStatusWhenValidSingleResult() {
        final String source = "104823 0";
        final Map<Integer, List<String>> expectedMap = ImmutableMap.of(
                0, ImmutableList.of("104823")
        );
        final Map<Integer, List<String>> resultMap = CrmReportUtils.getSalesByStatus(source);
        assertEquals(expectedMap.size(), resultMap.size());
    }

    @Test
    public void salesByStatusWhenValidResult() {
        final String source = "104823 0;104824 3;104825 0";
        final Map<Integer, List<String>> expectedMap = ImmutableMap.of(
                0, ImmutableList.of("104823", "104825"),
                3, ImmutableList.of("104824")
        );
        final Map<Integer, List<String>> resultMap = CrmReportUtils.getSalesByStatus(source);
        assertEquals(expectedMap.size(), resultMap.size());
    }
}
