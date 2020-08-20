package com.andersenlab.crm.services.impl;

import com.andersenlab.crm.exceptions.ResourceNotFoundException;
import com.andersenlab.crm.model.entities.Resume;
import com.andersenlab.crm.model.entities.ResumeRequest;
import com.andersenlab.crm.model.entities.ResumeRequestView;
import com.andersenlab.crm.model.entities.ResumeStatusHistory;
import com.andersenlab.crm.repositories.FileRepository;
import com.andersenlab.crm.repositories.ResumeRepository;
import com.andersenlab.crm.repositories.ResumeRequestRepository;
import com.andersenlab.crm.repositories.ResumeStatusHistoryRepository;
import com.andersenlab.crm.security.AuthenticatedUser;
import com.andersenlab.crm.services.FileUploaderHelper;
import com.andersenlab.crm.services.ResumeRequestService;
import org.junit.Before;
import org.junit.Test;
import org.springframework.context.ApplicationEventPublisher;

import java.time.LocalDateTime;

import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

public class ResumeServiceImplTest {

    private static final Long ID = 1L;
    private ResumeRepository resumeRepository;
    private FileUploaderHelper fileUploaderHelper;
    private ResumeServiceImpl resumeService;
    private ResumeStatusHistoryRepository resumeStatusHistoryRepository;

    @Before
    public void setUp() {
        resumeRepository = mock(ResumeRepository.class);
        fileUploaderHelper = mock(FileUploaderHelper.class);
        FileRepository fileRepository = mock(FileRepository.class);
        ResumeRequestService resumeRequestService = mock(ResumeRequestService.class);
        ResumeRequestRepository resumeRequestRepository = mock(ResumeRequestRepository.class);
        AuthenticatedUser authenticatedUser = mock(AuthenticatedUser.class);
        ApplicationEventPublisher eventPublisher = mock(ApplicationEventPublisher.class);
        resumeStatusHistoryRepository = mock(ResumeStatusHistoryRepository.class);
        resumeService = new ResumeServiceImpl(
                resumeRepository,
                fileUploaderHelper,
                fileRepository,
                resumeRequestService,
                resumeRequestRepository,
                authenticatedUser,
                eventPublisher,
                resumeStatusHistoryRepository
        );
    }

    @Test
    public void whenUpdateResumeThenOk() {
        ResumeStatusHistory resumeStatusHistory = new ResumeStatusHistory();
        Resume updateResumeRequest = new Resume();
        Resume resume = new Resume();
        Resume updated = new Resume();
        updated.setResumeRequest(new ResumeRequest());
        updated.setStatus(Resume.Status.DONE);
        ResumeRequestView resumeRequestView = new ResumeRequestView();
        resumeRequestView.setStatus(ResumeRequestView.BoardStatus.DONE);
        given(resumeRepository.findByIsActiveIsTrueAndId(ID)).willReturn(resume);

        given(resumeRepository.saveAndFlush(any(Resume.class)))
                .willReturn(updated);
        given(resumeStatusHistoryRepository.saveAndFlush(any(ResumeStatusHistory.class)))
                .willReturn(resumeStatusHistory);
        given(resumeRepository.findByIsActiveIsTrueAndId(ID)).willReturn(updated);

        resumeService.updateResume(ID, updateResumeRequest);
    }

    @Test(expected = ResourceNotFoundException.class)
    public void whenUpdateResumeThenResourceNotFound() {
        Resume updateResumeRequest = new Resume();

        given(resumeRepository.findOne(ID))
                .willThrow(new ResourceNotFoundException("Resume request not found"));

        resumeService.updateResume(ID, updateResumeRequest);
    }

    @Test
    public void whenGetResumeByIdThenReturnExpectedResponse() {
        given(resumeRepository.findByIsActiveIsTrueAndId(ID)).willReturn(new Resume());
        resumeService.getResumeById(ID);
        verify(resumeRepository, times(1)).findByIsActiveIsTrueAndId(ID);
    }

    @Test(expected = ResourceNotFoundException.class)
    public void whenGetResumeByIdThenResourceNotFound() {
        given(resumeRepository.findOne(ID)).willReturn(null);
        resumeService.getResumeById(ID);
        verify(resumeRepository, times(1)).findOne(ID);
    }

    @Test
    public void whenDetachFileFromResume() {
        resumeService.detachFileFromResume(ID);
        verify(fileUploaderHelper, times(1)).deleteFileById(ID);
    }

    @Test
    public void whenUpdateResumeThenHistoryAdded() {

        Resume resume = new Resume();
        resume.setId(ID);
        resume.setStatus(Resume.Status.HR_NEED);
        Resume savedResume = new Resume();
        savedResume.setId(ID);
        savedResume.setResumeRequest(new ResumeRequest());
        savedResume.setStatus(Resume.Status.IN_PROGRESS);
        ResumeStatusHistory resumeStatusHistory = new ResumeStatusHistory();
        resumeStatusHistory.setStatusStarted(LocalDateTime.now());
        resumeStatusHistory.setResume(savedResume);
        given(resumeRepository.saveAndFlush(any(Resume.class)))
                .willReturn(savedResume);
        given(resumeStatusHistoryRepository.findFirstByResumeOrderByStatusStartedDesc(any(Resume.class)))
                .willReturn(resumeStatusHistory);
        given(resumeRepository.findByIsActiveIsTrueAndId(ID)).willReturn(savedResume);
        resumeService.updateResume(ID, resume);
        then(resumeStatusHistoryRepository)
                .should(times(2))
                .saveAndFlush(any(ResumeStatusHistory.class));
    }
}