package com.andersenlab.crm.services.impl;

import com.andersenlab.crm.exceptions.CrmException;
import com.andersenlab.crm.exceptions.ResourceNotFoundException;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.model.entities.File;
import com.andersenlab.crm.model.entities.ResumeRequest;
import com.andersenlab.crm.model.entities.ResumeRequestView;
import com.andersenlab.crm.model.entities.SaleRequest;
import com.andersenlab.crm.repositories.CompanyRepository;
import com.andersenlab.crm.repositories.EmployeeRepository;
import com.andersenlab.crm.repositories.ResumeRequestCommentRepository;
import com.andersenlab.crm.repositories.ResumeRequestHistoryRepository;
import com.andersenlab.crm.repositories.ResumeRequestRepository;
import com.andersenlab.crm.repositories.ResumeRequestViewRepository;
import com.andersenlab.crm.rest.request.ResumeRequestUpdateRequest;
import com.andersenlab.crm.security.AuthenticatedUser;
import com.andersenlab.crm.services.AutoResponsibleRmService;
import com.andersenlab.crm.services.CompanySaleGoogleAdRecordService;
import com.andersenlab.crm.services.EmployeeService;
import com.andersenlab.crm.services.FileService;
import com.andersenlab.crm.services.FileUploaderHelper;
import com.querydsl.core.types.Predicate;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

public class ResumeRequestServiceImplTest {

    private static final String RESUME_REQUEST_NAME = "test name";
    private ResumeRequestRepository resumeRequestRepository = mock(ResumeRequestRepository.class);
    private FileUploaderHelper fileUploaderHelper = mock(FileUploaderHelper.class);
    private ResumeRequestViewRepository viewRepository = mock(ResumeRequestViewRepository.class);
    private AuthenticatedUser authenticatedUser = mock(AuthenticatedUser.class);
    private final FileService fileService = mock(FileService.class);
    private ResumeRequestHistoryRepository resumeRequestHistoryRepository = mock(ResumeRequestHistoryRepository.class);
    private ResumeRequestCommentRepository resumeRequestCommentRepository = mock(ResumeRequestCommentRepository.class);
    private static final String PREFIX_ID = "resumerequest";
    private final ApplicationEventPublisher eventPublisher = mock(ApplicationEventPublisher.class);
    private final EmployeeService employeeService = mock(EmployeeService.class);
    private CompanySaleGoogleAdRecordService googleAdRecordService = mock(CompanySaleGoogleAdRecordService.class);
    private final AutoResponsibleRmService autoResponsibleRmService = mock(AutoResponsibleRmService.class);
    private final EmployeeRepository employeeRepository = mock(EmployeeRepository.class);
    private final CompanyRepository companyRepository = mock(CompanyRepository.class);

    private ResumeRequestServiceImpl requestService = new ResumeRequestServiceImpl(
            resumeRequestRepository,
            fileUploaderHelper,
            viewRepository,
            authenticatedUser,
            fileService,
            resumeRequestHistoryRepository,
            resumeRequestCommentRepository,
            eventPublisher,
            employeeService,
            googleAdRecordService,
            autoResponsibleRmService,
            companyRepository,
            employeeRepository
    );

    @Mock
    private Page<ResumeRequest> page;

    @Test
    public void whenUpdateResumeRequestThenNameUpdated() {
        ResumeRequestUpdateRequest request = new ResumeRequestUpdateRequest();
        request.setName("updated");

        ResumeRequest stored = new ResumeRequest();
        stored.setName(RESUME_REQUEST_NAME);

        ResumeRequest updated = new ResumeRequest();
        updated.setName(request.getName());
        Employee employee = new Employee();
        given(resumeRequestRepository.findByIsActiveIsTrueAndId(Mockito.any(Long.class))).willReturn(stored);
        given(authenticatedUser.getCurrentEmployee()).willReturn(employee);

        requestService.update(updated);

        assertEquals(updated.getName(), request.getName());
    }

    @Test(expected = ResourceNotFoundException.class)
    public void whenUpdateResumeRequestAndResumeRequestNotFoundThenExpectedNotFoundException() {
        given(resumeRequestRepository.findOne(Mockito.any(Long.class))).willReturn(null);
        requestService.update(new ResumeRequest());
    }

    @Test(expected = ResourceNotFoundException.class)
    public void whenGetResumeRequestByIdAndResumeRequestNotFoundThenExpectedNotFoundException() {
        given(resumeRequestRepository.findOne(Mockito.any(Long.class))).willReturn(null);
        requestService.findRequestByIdOrThrow(0L);
    }

    @Test
    public void whenGetResumeRequestWithFilterThenReturnExpectedResponse() {
        List<ResumeRequest> resumeRequestList = new ArrayList<>();
        Page<ResumeRequest> resumeRequestPage = new PageImpl<>(resumeRequestList);

        given(resumeRequestRepository
                .findAll(any(Predicate.class), any(Pageable.class)))
                .willReturn(resumeRequestPage);

        Page<ResumeRequest> response =
                requestService.get(any(Predicate.class), any(Pageable.class));

        assertEquals(resumeRequestList.size(), response.getContent().size());
    }

    @Test
    public void whenAttachFileToResumeThenOk() {
        ResumeRequest request = new ResumeRequest();
        File file = new File();

        given(fileUploaderHelper.uploadFileAndGetEntity(any(String.class), any(MultipartFile.class))).willReturn(file);
        given(resumeRequestRepository.findByIsActiveIsTrueAndId(1L)).willReturn(request);

        requestService.attacheFile(1L, any(MultipartFile.class));

        verify(fileService, times(1)).save(file);
    }

    @Test(expected = CrmException.class)
    public void whenAttachFileToResumeThenReturnCrmException() {
        MockMultipartFile file = new MockMultipartFile("ResumeRequestFile", new byte[]{});
        File entityFile = fileUploaderHelper.uploadFileAndGetEntity(PREFIX_ID, file);

        requestService.attacheFile(2L, any(MultipartFile.class));

        verify(fileService, times(2)).save(entityFile);
    }

    @Test
    public void whenDetachFileThenReturnOk() {
        SaleRequest saleRequest = new SaleRequest();
        saleRequest.setId(10L);
        File file = new File();
        file.setSaleRequest(saleRequest);
        given(fileService.getById(any(Long.class))).willReturn(file);
        requestService.deleteFile(10L, 1L);
        verify(fileUploaderHelper, times(1)).delete(any(String.class));
    }

    @Test(expected = IllegalStateException.class)
    public void whenDetachFileThenReturnWithOutSaleRequestId() {
        SaleRequest saleRequest = new SaleRequest();
        File file = new File();
        file.setSaleRequest(saleRequest);
        given(fileService.getById(any(Long.class))).willReturn(file);
        requestService.deleteFile(10L, 1L);
        verify(fileUploaderHelper, times(1)).delete(any(String.class));
    }

    @Test(expected = IllegalStateException.class)
    public void whenDetachFileThenReturnWithOutSaleRequest() {
        File file = new File();
        given(fileService.getById(any(Long.class))).willReturn(file);
        requestService.deleteFile(10L, 1L);
        verify(fileUploaderHelper, times(1)).delete(any(String.class));
    }

    @Test
    public void whenUpdateResumeRequestStatus() {
        ResumeRequest request = new ResumeRequest();

        request.setStatus(ResumeRequest.Status.DONE);

        assertNotNull(request.getStatus());
        assertEquals(ResumeRequest.Status.DONE, request.getStatus());
    }

    @Test
    public void whenSetDoneDateOrNullThenSetDoneDate() {
        ResumeRequest resumeRequest = new ResumeRequest();
        resumeRequest.setId(1L);
        ResumeRequestView resumeRequestView = new ResumeRequestView();
        resumeRequestView.setStatus(ResumeRequestView.BoardStatus.DONE);

        given(viewRepository.findOne(resumeRequest.getId())).willReturn(resumeRequestView);

        requestService.setDoneDateOrNull(resumeRequest);

        assertNotNull(resumeRequest.getDoneDate());
        verify(viewRepository, times(1)).findOne(resumeRequest.getId());
    }

    @Test
    public void whenSetDoneOrNullThenSetNull() {
        ResumeRequest resumeRequest = new ResumeRequest();
        resumeRequest.setId(1L);
        ResumeRequestView resumeRequestView = new ResumeRequestView();
        resumeRequestView.setStatus(ResumeRequestView.BoardStatus.HR_NEED);

        given(viewRepository.findOne(resumeRequest.getId())).willReturn(resumeRequestView);

        requestService.setDoneDateOrNull(resumeRequest);

        assertNull(resumeRequest.getDoneDate());
        verify(viewRepository, times(1)).findOne(resumeRequest.getId());
    }

    @Test(expected = ResourceNotFoundException.class)
    public void whenSetDoneOrNullThenResourceNotFoundException() {
        ResumeRequest resumeRequest = new ResumeRequest();
        resumeRequest.setId(1L);

        given(viewRepository.findOne(resumeRequest.getId()))
                .willThrow(new ResourceNotFoundException("ResumeRequestView with this id not found"));

        requestService.setDoneDateOrNull(resumeRequest);

        verify(viewRepository, times(1)).findOne(resumeRequest.getId());
    }
}
