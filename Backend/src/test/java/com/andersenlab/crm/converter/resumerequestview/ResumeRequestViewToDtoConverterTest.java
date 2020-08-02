package com.andersenlab.crm.converter.resumerequestview;
import com.andersenlab.crm.model.entities.ResumeRequest.Status;
import com.andersenlab.crm.model.view.AllResumeRequestsView;
import com.andersenlab.crm.rest.dto.ResumeRequestViewDto;
import org.junit.Before;
import org.junit.Test;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

public class ResumeRequestViewToDtoConverterTest {

    private ResumeRequestViewToDtoConverter converter;
    private AllResumeRequestsView resumeRequestView;

    @Before
    public void setUp(){
        converter = new ResumeRequestViewToDtoConverter();
        resumeRequestView = getResumeRequestView();

    }

    @Test
    public void whenGetClassesThenReturnExpected() {
        assertEquals(converter.getSource(), AllResumeRequestsView.class);
        assertEquals(converter.getTarget(), ResumeRequestViewDto.class);
    }

    @Test
    public void convert() {
        ResumeRequestViewDto result = converter.convert(resumeRequestView);
        assertNotNull(result);
        assertEquals("AllResumeRequestsView id", resumeRequestView.getResumeRequestId(), result.getResumeRequestId());
        assertEquals("AllResumeRequestsView name", String.format("%d - %s", resumeRequestView.getResumeRequestId(), resumeRequestView.getName()), result.getName());
        assertEquals("AllResumeRequestsView status", resumeRequestView.getStatus().getName(), result.getStatus());
        assertEquals("AllResumeRequestsView deadLine", resumeRequestView.getDeadline(), result.getDeadline());
        assertEquals("AllResumeRequestsView createdDate", resumeRequestView.getCreateDate(), result.getCreateDate());
        assertEquals("AllResumeRequestsView companyName", resumeRequestView.getCompanyName(), result.getCompanyName());
        assertEquals("AllResumeRequestsView responsibleForSaleRequestName", resumeRequestView.getResponsibleForSaleRequestName(), result.getResponsibleForSaleRequestName());
        assertEquals("AllResumeRequestsView responsible", resumeRequestView.getResponsible(), result.getResponsible());
        assertEquals("AllResumeRequestsView returnsResumeCount", resumeRequestView.getReturnsResumeCount(), result.getReturnsResumeCount());
        assertEquals("AllResumeRequestsView countResume", resumeRequestView.getCountResume(), result.getCountResume());
        assertEquals("AllResumeRequestsView countResume", resumeRequestView.getIsActive(), result.getIsActive());
    }

    private AllResumeRequestsView getResumeRequestView(){
        AllResumeRequestsView theResumeRequestView = new AllResumeRequestsView();
        theResumeRequestView.setResumeRequestId(1L);
        theResumeRequestView.setName("Test name");
        theResumeRequestView.setCompanyId(1L);
        theResumeRequestView.setCompanyName("Company name");
        theResumeRequestView.setStatus(Status.PENDING);
        theResumeRequestView.setReturnsResumeCount(new BigDecimal("0"));
        theResumeRequestView.setDeadline(LocalDateTime.now());
        theResumeRequestView.setResponsibleId(1L);
        theResumeRequestView.setResponsible("Responsible");
        theResumeRequestView.setCreateDate(LocalDateTime.now());
        theResumeRequestView.setResponsibleForSaleRequestId(1L);
        theResumeRequestView.setResponsibleForSaleRequestName("Creator");
        theResumeRequestView.setCountResume(1L);
        theResumeRequestView.setIsActive(true);
        return theResumeRequestView;
    }
}