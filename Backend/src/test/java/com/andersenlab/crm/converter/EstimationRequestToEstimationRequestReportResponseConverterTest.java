package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.model.entities.EstimationRequest;
import com.andersenlab.crm.rest.response.EstimationRequestReportResponse;
import com.andersenlab.crm.utils.CrmReportUtils;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.mock;
import java.time.LocalDateTime;

public class EstimationRequestToEstimationRequestReportResponseConverterTest {

    private EstimationRequestToEstimationRequestReportResponseConverter converter =
            new EstimationRequestToEstimationRequestReportResponseConverter(mock(ConversionService.class));

    @Test
    public void whenConvertThenFieldsOfConvertedExpected() {
        EstimationRequest request = new EstimationRequest();
        request.setId(1L);
        request.setName("name");
        request.setDeadline(LocalDateTime.now());
        request.setCreateDate(LocalDateTime.now());
        request.setResponsibleForSaleRequest(null);
        request.setStatus(EstimationRequest.Status.DONE);
        request.setResponsibleForRequest(null);

        EstimationRequestReportResponse response = converter.convert(request);

        assertEquals(request.getId(), response.getId());
        assertEquals(request.getName(), response.getName());
        assertEquals(request.getDeadline().format(CrmReportUtils.DATE_FORMATTER), response.getDeadline());
        assertEquals(request.getCreateDate().format(CrmReportUtils.DATE_FORMATTER), response.getCreateDate());
        assertEquals("", response.getResponsibleForSaleRequest().toString());
        assertEquals(EstimationRequest.Status.DONE.getName(), response.getStatus());
        assertEquals("", response.getResponsibleForRequest().toString());

    }
}
