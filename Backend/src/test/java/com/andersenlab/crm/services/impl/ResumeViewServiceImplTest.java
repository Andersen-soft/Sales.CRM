package com.andersenlab.crm.services.impl;

import com.andersenlab.crm.model.view.ResumeView;
import com.andersenlab.crm.repositories.ResumeViewRepository;
import com.andersenlab.crm.services.ResumeViewService;
import com.querydsl.core.types.Predicate;
import org.junit.Before;
import org.junit.Test;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.mock;

public class ResumeViewServiceImplTest {
    private static final Long ID = 1L;
    private ResumeViewService resumeViewService;
    private ResumeView resumeView;
    private Page<ResumeView> resumeRequestPage;

    @Before
    public void setup() {
        ResumeViewRepository resumeViewRepository = mock(ResumeViewRepository.class);
        resumeView = new ResumeView();
        resumeView.setId(ID);
        List<ResumeView> resumeViews = new ArrayList<>();
        resumeRequestPage = new PageImpl<>(resumeViews);

        given(resumeViewRepository.findOne(any(Long.class))).willReturn(resumeView);
        given(resumeViewRepository
                .findAll(any(Predicate.class), any(Pageable.class)))
                .willReturn(resumeRequestPage);

        resumeViewService = new ResumeViewServiceImpl(resumeViewRepository);
    }

    @Test
    public void getResumeViewById() {
        ResumeView response = resumeViewService.get(ID);

        assertNotNull(response);
        assertEquals(resumeView, response);
    }

    @Test
    public void getResumes() {
        Page<ResumeView> response =
                resumeViewService.get(any(Predicate.class), any(Pageable.class));
         assertNotNull(response);
        assertEquals(resumeRequestPage.getSize(), response.getContent().size());
    }

}
