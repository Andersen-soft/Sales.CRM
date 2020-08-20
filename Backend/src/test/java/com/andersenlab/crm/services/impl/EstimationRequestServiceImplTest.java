package com.andersenlab.crm.services.impl;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.exceptions.CrmException;
import com.andersenlab.crm.exceptions.ResourceNotFoundException;
import com.andersenlab.crm.model.entities.CompanySale;
import com.andersenlab.crm.model.entities.EstimationRequest;
import com.andersenlab.crm.model.entities.File;
import com.andersenlab.crm.repositories.EstimationRequestCommentRepository;
import com.andersenlab.crm.repositories.EstimationRequestRepository;
import com.andersenlab.crm.repositories.FileRepository;
import com.andersenlab.crm.rest.request.EstimationRequestCreate;
import com.andersenlab.crm.rest.request.EstimationRequestUpdate;
import com.andersenlab.crm.security.AuthenticatedUser;
import com.andersenlab.crm.services.CompanySaleGoogleAdRecordService;
import com.andersenlab.crm.services.CompanySaleServiceNew;
import com.andersenlab.crm.services.CompanyService;
import com.andersenlab.crm.services.EmployeeService;
import com.andersenlab.crm.services.FileService;
import com.andersenlab.crm.services.FileUploaderHelper;
import org.junit.Test;
import org.mockito.Mockito;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Example;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertSame;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

public class EstimationRequestServiceImplTest {

    private static final String RESUME_REQUEST_PROJECT_DESCRIPTION = "test description";
    private EstimationRequestRepository estimationRequestRepository = mock(EstimationRequestRepository.class);
    private EstimationRequestCommentRepository estimationRequestCommentRepository = mock(EstimationRequestCommentRepository.class);
    private EmployeeService employeeService = mock(EmployeeService.class);
    private CompanySaleGoogleAdRecordService googleAdRecordService = mock(CompanySaleGoogleAdRecordService.class);
    private ConversionService conversionService = mock(ConversionService.class);
    private AuthenticatedUser authenticatedUser = mock(AuthenticatedUser.class);
    private CompanySaleServiceNew companySaleServiceNew = mock(CompanySaleServiceNew.class);
    private FileUploaderHelper fileUploaderHelper = mock(FileUploaderHelper.class);
    private FileRepository fileRepository = mock(FileRepository.class);
    private CompanyService companyService = mock(CompanyService.class);
    private FileService fileService = mock(FileService.class);
    private ApplicationEventPublisher eventPublisher = mock(ApplicationEventPublisher.class);

    private EstimationRequestServiceImpl requestService = new EstimationRequestServiceImpl(
            estimationRequestRepository,
            estimationRequestCommentRepository,
            employeeService,
            googleAdRecordService,
            conversionService,
            authenticatedUser,
            companySaleServiceNew,
            fileUploaderHelper,
            fileRepository,
            companyService,
            fileService,
            eventPublisher
    );

    @Test
    public void whenCreateEstimationRequestThenRepositorySaveAndFlush() {
        EstimationRequestCreate request = new EstimationRequestCreate();
        request.setName("description");
        request.setCompanyId(1L);
        request.setCompanySale(1L);

        EstimationRequest resumeRequest1 = new EstimationRequest();
        resumeRequest1.setId(1L);

        EstimationRequest resumeRequest = new EstimationRequest();
        resumeRequest.setName("description");
        Example<EstimationRequest> resumeRequestExample = Example.of(resumeRequest);

        CompanySale exampleSale = new CompanySale();
        resumeRequest1.setCompanySale(exampleSale);

        given(companySaleServiceNew.findCompanySaleByIdOrThrowException(1L)).willReturn(exampleSale);
        given(conversionService.convert(request, EstimationRequest.class)).willReturn(resumeRequest1);
        given(estimationRequestRepository.exists(resumeRequestExample)).willReturn(false);
        given(estimationRequestRepository.saveAndFlush(any(EstimationRequest.class))).willReturn(resumeRequest1);

        requestService.createRequest(request, null);

        verify(estimationRequestRepository, times(1)).saveAndFlush(resumeRequest1);
    }

    @Test
    public void whenUpdateEstimationRequestThenNameUpdated() {
        EstimationRequestUpdate request = new EstimationRequestUpdate();
        final String NEW_NAME = "new name";
        request.setName(NEW_NAME);

        EstimationRequest stored = new EstimationRequest();
        stored.setName("name");
        EstimationRequest patch = new EstimationRequest();
        stored.setName(NEW_NAME);

        given(estimationRequestRepository.findOne(Mockito.any(Long.class))).willReturn(stored);
        given(conversionService.convert(Mockito.any(), Mockito.any())).willReturn(patch);

        requestService.updateRequest(0L, request);
        assertEquals(stored.getName(), NEW_NAME);
    }

    @Test(expected = ResourceNotFoundException.class)
    public void whenUpdateEstimationRequestAndEstimationRequestNotFoundThenExpectedNotFoundException() {
        given(estimationRequestRepository.findOne(Mockito.any(Long.class))).willReturn(null);
        requestService.updateRequest(0L, new EstimationRequestUpdate());
    }

    @Test
    public void whenDeleteEstimationRequestSomeInactiveEstimationsThenNoExceptions() {
        File estimation = new File();
        EstimationRequest estimationRequest = new EstimationRequest();
        estimationRequest.setIsActive(true);
        estimationRequest.setEstimations(Arrays.asList(estimation));
        given(estimationRequestRepository.findOne(Mockito.anyLong())).willReturn(estimationRequest);
        requestService.deleteRequest(1L);
    }

    @Test
    public void whenDeleteEstimationRequestNotFoundThenNoExceptions() {
        given(estimationRequestRepository.findOne(Mockito.anyLong())).willReturn(null);
        requestService.deleteRequest(1L);
    }

    @Test
    public void whenGetEstimationRequestByIdThenReturnExpectedResponse() {
        EstimationRequest segment = new EstimationRequest();
        segment.setName(RESUME_REQUEST_PROJECT_DESCRIPTION);
        given(estimationRequestRepository.findByIsActiveTrueAndId(any(Long.class))).willReturn(segment);

        EstimationRequest segmentByName = requestService.getActiveRequestById(0L);

        assertSame(segment, segmentByName);
    }

    @Test(expected = ResourceNotFoundException.class)
    public void whenGetEstimationRequestByIdAndEstimationRequestNotFoundThenExpectedNotFoundException() {
        given(estimationRequestRepository.findOne(Mockito.any(Long.class))).willReturn(null);
        requestService.getActiveRequestById(0L);
    }

    @Test
    public void whenAttachFileToEstimationThenOk() {
        EstimationRequest request = new EstimationRequest();
        File entityFile = new File();

        given(fileUploaderHelper.uploadFileAndGetEntity(any(String.class), any(MultipartFile.class))).willReturn(entityFile);
        given(estimationRequestRepository.findOne(1L)).willReturn(request);

        requestService.attacheFile(1L, any(MultipartFile.class));

        verify(fileRepository, times(1)).saveAndFlush(entityFile);
    }

    @Test(expected = CrmException.class)
    public void whenAttachFileToEstimationThenReturnCrmException() {
        MockMultipartFile file = new MockMultipartFile("name", new byte[]{});
        String prefixId = "estimationrequest/100";
        File entityFile = fileUploaderHelper.uploadFileAndGetEntity(prefixId, file);

        requestService.attacheFile(1L, any(MultipartFile.class));

        verify(fileRepository, times(1)).save(entityFile);
    }

    @Test
    public void whenUpdateEstimationRequestStatus() {
        EstimationRequest request = new EstimationRequest();

        request.setStatus(EstimationRequest.Status.ESTIMATION_NEED);

        assertNotNull(request.getStatus());
        assertEquals(EstimationRequest.Status.ESTIMATION_NEED, request.getStatus());
    }
}
