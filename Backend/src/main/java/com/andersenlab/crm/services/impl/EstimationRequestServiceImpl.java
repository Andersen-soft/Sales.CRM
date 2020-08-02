package com.andersenlab.crm.services.impl;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.events.EstimationRequestCreatedEvent;
import com.andersenlab.crm.events.EstimationRequestStatusChangedEvent;
import com.andersenlab.crm.exceptions.CrmException;
import com.andersenlab.crm.exceptions.ResourceNotFoundException;
import com.andersenlab.crm.model.Nameable;
import com.andersenlab.crm.model.RoleEnum;
import com.andersenlab.crm.model.entities.Company;
import com.andersenlab.crm.model.entities.CompanySale;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.model.entities.EstimationRequest;
import com.andersenlab.crm.model.entities.EstimationRequestComment;
import com.andersenlab.crm.model.entities.File;
import com.andersenlab.crm.model.entities.QEstimationRequest;
import com.andersenlab.crm.model.entities.SaleRequest;
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
import com.andersenlab.crm.services.EstimationRequestService;
import com.andersenlab.crm.services.FileService;
import com.andersenlab.crm.services.FileUploaderHelper;
import com.google.common.collect.ImmutableSet;
import com.querydsl.core.types.Predicate;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.function.Consumer;
import java.util.stream.Collectors;

import static com.andersenlab.crm.model.entities.EstimationRequest.Status.PENDING;
import static com.andersenlab.crm.utils.CrmStringUtils.fixStringDescription;
import static java.util.Optional.of;
import static java.util.Optional.ofNullable;

@Service
@RequiredArgsConstructor
@Transactional
public class EstimationRequestServiceImpl implements EstimationRequestService {
    private static final String STORAGE_CATALOG = "estimationrequest";
    private static final String DELIMITER = ", ";

    private final EstimationRequestRepository estimationRequestRepository;
    private final EstimationRequestCommentRepository estimationRequestCommentRepository;
    private final EmployeeService employeeService;
    private final CompanySaleGoogleAdRecordService googleAdRecordService;
    private final ConversionService conversionService;
    private final AuthenticatedUser authenticatedUser;
    private final CompanySaleServiceNew companySaleServiceNew;
    private final FileUploaderHelper fileUploaderHelper;
    private final FileRepository fileRepository;
    private final CompanyService companyService;
    private final FileService fileService;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    @Transactional
    public EstimationRequest createRequest(EstimationRequestCreate request, MultipartFile[] files) {
        EstimationRequest estimationRequest = constructEstimationRequest(request);
        CompanySale companySale = companySaleServiceNew.findCompanySaleByIdOrThrowException(request.getCompanySale());
        estimationRequest.setCompanySale(companySale);

        if (companySale.getStatus() != CompanySale.Status.ARCHIVE
                && companySale.getStatus() != CompanySale.Status.CONTRACT) {
            companySale.setStatus(CompanySale.Status.OPPORTUNITY);
            googleAdRecordService.updateRecordOnSaleStatusChanged(companySale);
        }

        EstimationRequest persisted = estimationRequestRepository.saveAndFlush(estimationRequest);

        List<File> fileList = fileUploaderHelper.uploadFilesAndGetEntities(STORAGE_CATALOG, files);
        updateFileListData(fileList, persisted);

        Optional.ofNullable(request.getComment())
                .filter(it -> !it.isEmpty())
                .ifPresent(description -> {
                    EstimationRequestComment comment = new EstimationRequestComment();
                    comment.setDescription(fixStringDescription(description));
                    comment.setEmployee(authenticatedUser.getCurrentEmployee());
                    comment.setEstimationRequest(estimationRequest);
                    estimationRequest.getComments().add(comment);
                    estimationRequestCommentRepository.saveAndFlush(comment);
                });

        eventPublisher.publishEvent(EstimationRequestCreatedEvent
                .builder()
                .estimationRequestId(persisted.getId())
                .build());

        return persisted;
    }

    private void updateFileListData(List<File> fileList, EstimationRequest request) {
        fileList.forEach(file -> {
            file.setSaleRequest(request);
            file.setUploadedBy(request.getAuthor());
            fileRepository.saveAndFlush(file);
        });
    }

    @Override
    public EstimationRequest create(EstimationRequest request) {
        return estimationRequestRepository.saveAndFlush(request);
    }

    private EstimationRequest constructEstimationRequest(EstimationRequestCreate request) {
        EstimationRequest estimationRequest = conversionService.convert(request, EstimationRequest.class);
        Employee employee = authenticatedUser.getCurrentEmployee();
        estimationRequest.setAuthor(employee);
        estimationRequest.setResponsibleForSaleRequest(employee);
        Company company = companyService.findCompanyByIdOrThrowException(request.getCompanyId());
        estimationRequest.setCompany(company);
        estimationRequest.setStatus(EstimationRequest.Status.ESTIMATION_NEED);
        estimationRequest.setIsActive(true);
        return estimationRequest;
    }

    @Override
    @Transactional
    public void updateRequest(Long id, EstimationRequestUpdate request) {
        EstimationRequest persisted = findRequestByIdOrThrow(id);
        EstimationRequest patch = conversionService.convert(request, EstimationRequest.class);
        EstimationRequest.Status newStatus = patch.getStatus();
        validateStatuses(persisted, patch.getStatus());
        if (newStatus != null && !persisted.getStatus().equals(newStatus)) {
            patch.setStatusChangedDate(LocalDateTime.now());
            eventPublisher.publishEvent(EstimationRequestStatusChangedEvent
                    .builder()
                    .newStatus(newStatus)
                    .estimationRequestId(id)
                    .build());
        }
        updateRequestFields(persisted, patch);
        estimationRequestRepository.saveAndFlush(persisted);
    }

    @Override
    public EstimationRequest updateRequest(EstimationRequest entity) {
        EstimationRequest persisted = findRequestByIdOrThrow(entity.getId());
        ofNullable(entity.getOldId()).ifPresent(persisted::setOldId);
        ofNullable(entity.getName()).ifPresent(persisted::setName);
        ofNullable(entity.getCompany()).ifPresent(persisted::setCompany);
        return estimationRequestRepository.saveAndFlush(persisted);
    }

    private void updateRequestFields(EstimationRequest persistedRequest, EstimationRequest updateRequest) {
        ofNullable(updateRequest.getDeadline()).ifPresent(persistedRequest::setDeadline);
        ofNullable(updateRequest.getStatusChangedDate()).ifPresent(persistedRequest::setStatusChangedDate);
        ofNullable(updateRequest.getResponsibleRM()).ifPresent(rm ->
                setResponsibleAndCheckRoles(rm, "RM", ImmutableSet.of(RoleEnum.ROLE_RM, RoleEnum.ROLE_MANAGER),
                        persistedRequest::setResponsibleRM)
        );
        ofNullable(updateRequest.getResponsibleForRequest()).ifPresent(rm ->
                setResponsibleAndCheckRoles(rm, "for request", ImmutableSet.of(RoleEnum.ROLE_RM, RoleEnum.ROLE_MANAGER),
                        persistedRequest::setResponsibleForRequest)
        );
        ofNullable(updateRequest.getCompany()).ifPresent(company ->
                persistedRequest.setCompany(companyService.findCompanyByIdOrThrowException(company.getId())));
        ofNullable(updateRequest.getStatus()).ifPresent(persistedRequest::setStatus);
        ofNullable(updateRequest.getName()).ifPresent(persistedRequest::setName);
        ofNullable(updateRequest.getCompanySale()).ifPresent(companySale -> {
            if (companySale.getId() == -1) {
                persistedRequest.setCompanySale(null);
            } else if (saleExistInCompanySales(updateRequest.getCompanySale(), persistedRequest.getCompany().getCompanySales())) {
                persistedRequest.setCompanySale(companySaleServiceNew.findCompanySaleByIdOrThrowException(companySale.getId()));
            } else {
                throw new CrmException("Нельзя привязывать запросы от одной компании к продажам другой компании");
            }
        });
    }

    private void setResponsibleAndCheckRoles(
            final Employee rm,
            final String systemRole,
            final ImmutableSet<RoleEnum> roles,
            final Consumer<Employee> responsibleForSetter
    ) {
        if (rm.getId() != -1) {
            responsibleForSetter.accept(
                    of(employeeService.getEmployeeByIdOrThrowException(rm.getId()))
                            .filter(Employee::getIsActive)
                            .filter(roleStream -> roleStream.getRoles()
                                    .stream()
                                    .anyMatch(cRoleName -> roles.contains(cRoleName.getName())))
                            .orElseThrow(() ->
                                    new CrmException(getMessageForRoles(systemRole, roles)))
            );
        } else {
            responsibleForSetter.accept(null);
        }
    }

    private String getMessageForRoles(final String systemRole, final ImmutableSet<RoleEnum> roles) {
        return "'Responsible " + systemRole + "' should be " + StringUtils.join(roles, DELIMITER);
    }

    private boolean saleExistInCompanySales(CompanySale companySale, List<CompanySale> companySales) {
        return companySales.stream()
                .map(CompanySale::getId)
                .anyMatch(sale -> sale.equals(companySale.getId()));
    }

    @Override
    public void deleteRequest(Long id) {
        ofNullable(estimationRequestRepository.findOne(id))
                .filter(EstimationRequest::getIsActive)
                .ifPresent(estimationRequest -> {
                    estimationRequest.setIsActive(false);
                    ofNullable(estimationRequest.getEstimations())
                            .map(Collection::stream)
                            .ifPresent(estimations -> estimations.map(File::getId)
                                    .forEach(fileUploaderHelper::deleteFileFromAmazonById));

                    estimationRequestRepository.saveAndFlush(estimationRequest);
                });
    }

    @Override
    public EstimationRequest getActiveRequestById(Long id) {
        return ofNullable(estimationRequestRepository.findByIsActiveTrueAndId(id))
                .orElseThrow(() -> new ResourceNotFoundException("Active estimation request not found"));
    }

    @Override
    public EstimationRequest findRequestByIdOrThrow(Long id) {
        return ofNullable(estimationRequestRepository.findOne(id))
                .orElseThrow(() -> new ResourceNotFoundException("Estimation request not found"));
    }

    @Override
    public Page<EstimationRequest> getRequestsWithFilter(Predicate predicate, Pageable pageable) {
        return estimationRequestRepository.findAll(predicate, pageable);
    }

    @Override
    public Page<EstimationRequest> getRequestsWithFilterForReport(Predicate predicate, Pageable pageable) {
        return estimationRequestRepository.findAll(predicate, pageable);
    }

    @Override
    public Page<EstimationRequest> getNotTiedToSalesRequestsWithFilter(Predicate predicate, Pageable pageable) {
        Predicate p = QEstimationRequest.estimationRequest.companySale.isNull().and(predicate);
        return estimationRequestRepository.findAll(p, pageable);
    }

    @Override
    public List<String> getStatuses() {
        return Arrays.stream(EstimationRequest.Status.values())
                .sorted()
                .map(Nameable::getName)
                .collect(Collectors.toList());
    }

    @Override
    public File attachEstimation(Long id, MultipartFile file) {
        EstimationRequest estimationRequest = findRequestByIdOrThrow(id);
        File entityFile = fileUploaderHelper.uploadFileAndGetEntity(STORAGE_CATALOG, file);
        entityFile.setEstimation(estimationRequest);
        return fileRepository.save(entityFile);
    }

    @Override
    public void detachEstimation(Long estimationId, Long idFile) {
        EstimationRequest estimationRequest = findRequestByIdOrThrow(estimationId);
        File file = estimationRequest.getEstimations().stream()
                .filter(it -> Objects.equals(it.getId(), idFile))
                .findFirst().orElseThrow(() -> new CrmException("Оценка не пренадлежит данному запросу на оценку"));
        fileUploaderHelper.deleteFileById(file.getId());
    }

    @Override
    public File attacheFile(Long id, MultipartFile file) {
        EstimationRequest estimationRequest = findRequestByIdOrThrow(id);
        File entityFile = fileUploaderHelper.uploadFileAndGetEntity(STORAGE_CATALOG, file);
        entityFile.setSaleRequest(estimationRequest);
        return fileRepository.saveAndFlush(entityFile);
    }

    @Override
    public List<File> attachMultipleFiles(Long id, List<MultipartFile> files) {
        return files.stream()
                .map(file -> attacheFile(id, file))
                .collect(Collectors.toList());
    }

    @Override
    public void detachFile(Long estimationId, Long idFile) {
        File file = fileService.getById(idFile);
        SaleRequest saleRequest = file.getSaleRequest();
        if (saleRequest != null && !Objects.equals(saleRequest.getId(), estimationId)) {
            throw new CrmException("Вложение не пренадлежит данному запросу на оценку");
        }
        fileUploaderHelper.deleteFileById(idFile);
    }

    @Override
    public void attachToSale(Long id, Long companySaleId) {
        EstimationRequest request = findRequestByIdOrThrow(id);
        request.setCompanySale(companySaleServiceNew.findCompanySaleByIdOrThrowException(companySaleId));
        estimationRequestRepository.saveAndFlush(request);
    }

    @Override
    public void detachToSale(Long id) {
        EstimationRequest request = findRequestByIdOrThrow(id);
        request.setCompanySale(null);
        estimationRequestRepository.saveAndFlush(request);
    }

    private void validateStatuses(EstimationRequest persisted, EstimationRequest.Status newStatus) {
        if (persisted.getResponsibleForRequest() == null && newStatus != null && newStatus != PENDING) {
            throw new CrmException("You can't change the status since no responsible has been specified");
        }
    }

    @Override
    public EstimationRequest findOne(Predicate predicate) {
        return estimationRequestRepository.findOne(predicate);
    }

    @Override
    public void validateById(Long id) {
        if (!estimationRequestRepository.existsById(id)) {
            throw new CrmException("Запрос на оценку с id = " + id + " не найден");
        }
    }

    @Override
    public Page<File> getFiles(Pageable pageable, Long id) {
        validateById(id);
        return fileService.getFileBySaleRequestId(pageable, id);
    }

    @Override
    public EstimationRequest getByOldId(Long oldId) {
        return estimationRequestRepository.findByOldId(oldId);
    }
}
