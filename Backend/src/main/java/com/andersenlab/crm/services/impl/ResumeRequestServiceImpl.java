package com.andersenlab.crm.services.impl;

import com.andersenlab.crm.events.ResumeRequestStatusChangedEvent;
import com.andersenlab.crm.exceptions.CrmException;
import com.andersenlab.crm.exceptions.ResourceNotFoundException;
import com.andersenlab.crm.model.RoleEnum;
import com.andersenlab.crm.model.entities.Company;
import com.andersenlab.crm.model.entities.CompanySale;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.model.entities.File;
import com.andersenlab.crm.model.entities.Resume;
import com.andersenlab.crm.model.entities.ResumeRequest;
import com.andersenlab.crm.model.entities.ResumeRequestComment;
import com.andersenlab.crm.model.entities.ResumeRequestHistory;
import com.andersenlab.crm.model.entities.ResumeRequestView;
import com.andersenlab.crm.model.entities.Role;
import com.andersenlab.crm.model.entities.SaleRequest;
import com.andersenlab.crm.repositories.CompanyRepository;
import com.andersenlab.crm.repositories.EmployeeRepository;
import com.andersenlab.crm.repositories.ResumeRequestCommentRepository;
import com.andersenlab.crm.repositories.ResumeRequestHistoryRepository;
import com.andersenlab.crm.repositories.ResumeRequestRepository;
import com.andersenlab.crm.repositories.ResumeRequestViewRepository;
import com.andersenlab.crm.security.AuthenticatedUser;
import com.andersenlab.crm.services.AutoResponsibleRmService;
import com.andersenlab.crm.services.CompanySaleGoogleAdRecordService;
import com.andersenlab.crm.services.EmployeeService;
import com.andersenlab.crm.services.FileService;
import com.andersenlab.crm.services.FileUploaderHelper;
import com.andersenlab.crm.services.ResumeRequestService;
import com.querydsl.core.types.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;

import static com.andersenlab.crm.model.entities.ResumeRequest.Status.CTO_NEED;
import static com.andersenlab.crm.model.entities.ResumeRequest.Status.DONE;
import static com.andersenlab.crm.model.entities.ResumeRequest.Status.PENDING;
import static com.andersenlab.crm.utils.ServiceUtils.getEnumNames;
import static java.lang.Boolean.FALSE;
import static java.lang.Boolean.TRUE;
import static java.util.Optional.ofNullable;

@Service
@RequiredArgsConstructor
public class ResumeRequestServiceImpl implements ResumeRequestService {

    private static final String STORAGE_CATALOG = "resumerequest";

    private final ResumeRequestRepository resumeRequestRepository;
    private final FileUploaderHelper fileUploaderHelper;
    private final ResumeRequestViewRepository viewRepository;
    private final AuthenticatedUser authenticatedUser;
    private final FileService fileService;
    private final ResumeRequestHistoryRepository resumeRequestHistoryRepository;
    private final ResumeRequestCommentRepository resumeRequestCommentRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final EmployeeService employeeService;
    private final CompanySaleGoogleAdRecordService googleAdRecordService;
    private final AutoResponsibleRmService autoResponsibleRmService;
    private final CompanyRepository companyRepository;
    private final EmployeeRepository employeeRepository;

    @Override
    @Transactional
    public ResumeRequest create(ResumeRequest resumeRequest, MultipartFile[] files) {
        resumeRequestRepository.saveAndFlush(resumeRequest);
        List<File> fileList = fileUploaderHelper.uploadFilesAndGetEntities(getPrefixId(resumeRequest), files);
        updateFileListData(fileList, resumeRequest);
        resumeRequest.setFiles(fileList);
        Company companyResumeRequest = companyRepository.findOne(resumeRequest.getCompany().getId());

        updateCompanySaleStatus(resumeRequest);

        if (!ObjectUtils.isEmpty(companyResumeRequest.getResponsible())) {
            resumeRequest.setResponsibleRM(companyResumeRequest.getResponsible());
            resumeRequest.setAutoDistribution(FALSE);

            return resumeRequestRepository.saveAndFlush(resumeRequest);
        }

        updateDistribution(resumeRequest);

        return resumeRequestRepository.saveAndFlush(resumeRequest);
    }

    @Override
    public ResumeRequest findRequestByIdOrThrow(Long id) {
        return Optional.ofNullable(resumeRequestRepository.findByIsActiveIsTrueAndId(id))
                .orElseThrow(() -> new ResourceNotFoundException("Resume request not found"));
    }

    @Override
    public List<String> getPriorities() {
        return getEnumNames(ResumeRequest.Priority.class);
    }

    @Override
    public List<String> getStatuses() {
        return getEnumNames(ResumeRequest.Status.class);
    }

    @Override
    public File attacheFile(Long id, MultipartFile file) {
        ResumeRequest resumeRequest = findRequestByIdOrThrow(id);
        File entityFile = fileUploaderHelper.uploadFileAndGetEntity(getPrefixId(resumeRequest), file);
        entityFile.setSaleRequest(resumeRequest);
        entityFile.setUploadedBy(authenticatedUser.getCurrentEmployee());
        return fileService.save(entityFile);
    }

    @Override
    @Transactional
    public void deleteFile(Long id, Long fileId) {
        File file = fileService.getById(fileId);
        validateFileByResumeRequestId(id, file);
        fileService.delete(file);
        fileUploaderHelper.delete(file.getKey());
    }

    @Override
    public void setDoneDateOrNull(ResumeRequest request) {
        ResumeRequestView view = getRequestViewByIdOrThrow(request.getId());
        ResumeRequestView.BoardStatus boardStatus = view.getStatus();
        if (boardStatus.equals(ResumeRequestView.BoardStatus.DONE)) {
            request.setDoneDate(LocalDateTime.now());
        } else {
            request.setDoneDate(null);
        }
        resumeRequestRepository.save(request);
    }

    @Override
    public ResumeRequest create(ResumeRequest entity) {
        return resumeRequestRepository.save(entity);
    }

    @Transactional
    @Override
    public ResumeRequest update(ResumeRequest entity) {
        ResumeRequest persisted = findRequestByIdOrThrow(entity.getId());

        ResumeRequest.Status newStatus = entity.getStatus();
        validateStatuses(persisted, newStatus);

        if (newStatus != null && !persisted.getStatus().equals(newStatus)) {
            persisted.setStatusChangedDate(LocalDateTime.now());
            eventPublisher.publishEvent(ResumeRequestStatusChangedEvent.builder()
                    .newStatus(newStatus)
                    .resumeRequestId(entity.getId())
                    .build());
            persisted.setAutoDistribution(false);
            ofNullable(persisted.getResponsibleRM()).ifPresent(responsible -> {
                if (Boolean.TRUE.equals(responsible.getResponsibleRM())) {
                    persisted.getCompany().setResponsible(responsible);
                }
            });
        }
        return resumeRequestRepository.saveAndFlush(updateFields(persisted, entity));
    }

    @Override
    public void validateById(Long id) {
        if (!resumeRequestRepository.existsById(id)) {
            throw new CrmException("Запрос на резюме с id = " + id + " не найдена");
        }
    }

    @Override
    public Page<ResumeRequest> get(Predicate predicate, Pageable pageable) {
        return resumeRequestRepository.findAll(predicate, pageable);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        ResumeRequest resumeRequest = findRequestByIdOrThrow(id);
        validateResumesNotEmpty(resumeRequest.getResumes());
        resumeRequest.setCompanySale(null);
        if (resumeRequest.isAutoDistribution() && resumeRequest.getResponsibleRM() != null) {
            Employee nextRmInQueue = autoResponsibleRmService.autoResponsibleRmEmployee();
            resumeRequest.getResponsibleRM().setDistributionDateRm(nextRmInQueue.getDistributionDateRm().minusMinutes(1));
        }
        resumeRequest.setIsActive(false);
        resumeRequest.setAutoDistribution(false);

        /* CODE SMELL
         * Flush is required since later on, AuditAspect generates history based on this event,
         * and while history is generated, this specific entity gets detached from EntityManager,
         * therefore resetting all the uncommitted changes for deleted ResumeRequest. Which results
         * in ResumeRequest not being deleted at all.
         *
         * See AuditHandler -> onUpdate method.
         *
         * Note that this is not the only place where flush is required, most likely for the same
         * reason.
         */
        resumeRequestRepository.saveAndFlush(resumeRequest);
    }

    @Override
    public Page<ResumeRequestHistory> getHistories(Pageable pageable, Long id) {
        return resumeRequestHistoryRepository.findByResumeRequestId(pageable, id);
    }

    @Override
    public Page<File> getFiles(Pageable pageable, Long id) {
        return fileService.getFileBySaleRequestId(pageable, id);
    }

    @Override
    public Page<ResumeRequestComment> getComments(Pageable pageable, Long id) {
        return resumeRequestCommentRepository.findByResumeRequestId(pageable, id);
    }

    @Transactional
    public void validateChangeResponsibleRm(ResumeRequest persisted, Employee responsibleRM) {
        Employee currentEmployee = authenticatedUser.getCurrentEmployee();
        Set<Role> roles = currentEmployee.getRoles();
        boolean isSalesHead = roles.stream().anyMatch(r -> r.getName().equals(RoleEnum.ROLE_SALES_HEAD));

        validateSalesHead(persisted, responsibleRM, isSalesHead);

        if (!persisted.isAutoDistribution() || isSalesHead) {
            setResponsibleRM(persisted, responsibleRM);
        } else if (persisted.getResponsibleRM() == null &&
                currentEmployee.getResponsibleRM() &&
                roles.stream().anyMatch(r -> r.getName().equals(RoleEnum.ROLE_RM))) {
            if (currentEmployee.getId().equals(responsibleRM.getId())) {
                setResponsibleRM(persisted, responsibleRM);
            } else {
                throw new CrmException("You can set only yourself as ResponsibleRM");
            }
        } else {
            throw new CrmException("Запрос находится в автораспределении или данный пользователь не является RM, участвующим в автораспределении");
        }
    }

    private void validateSalesHead(ResumeRequest persisted, Employee responsibleRM, boolean isSalesHead) {
        if (isSalesHead && persisted.isAutoDistribution() && persisted.getResponsibleRM() != null) {
            Employee nextRmInQueue = autoResponsibleRmService.autoResponsibleRmEmployee();
            persisted.getResponsibleRM().setDistributionDateRm(nextRmInQueue.getDistributionDateRm().minusMinutes(1));
            setResponsibleRM(persisted, responsibleRM);
        }
    }

    private void validateFileByResumeRequestId(Long id, File file) {
        SaleRequest saleRequest = defineSaleRequest(file);
        if (!id.equals(saleRequest.getId())) {
            throw new IllegalStateException("Validation failed: resume request can't contains this file.");
        }
    }

    private SaleRequest defineSaleRequest(File file) {
        return Optional.ofNullable(file.getSaleRequest())
                .orElseThrow(() -> new IllegalStateException("Validation failed: resume request can't contains this file."));
    }

    private ResumeRequestView getRequestViewByIdOrThrow(Long id) {
        return Optional.ofNullable(viewRepository.findOne(id))
                .orElseThrow(() -> new ResourceNotFoundException("ResumeRequestView with this id not found"));
    }

    private void validateStatuses(ResumeRequest persisted, ResumeRequest.Status newStatus) {
        boolean isResumeInWork = persisted.getResumes().stream()
                .filter(Resume::getIsActive)
                .anyMatch(resume -> resume.getStatus().equals(Resume.Status.HR_NEED)
                        || resume.getStatus().equals(Resume.Status.IN_PROGRESS));

        if (newStatus != null && (newStatus.equals(CTO_NEED) || newStatus.equals(DONE)) && isResumeInWork) {
            throw new CrmException("exception.resumeRequest.onStatusChange.resumeInProgress");
        }

        if (persisted.getResponsibleRM() == null && newStatus != null && newStatus != PENDING) {
            throw new CrmException("You can't change the status since no responsible has been specified");
        }
    }

    private void validateResumesNotEmpty(List<Resume> resumes) {
        if (Objects.nonNull(resumes) && resumes.stream().anyMatch(Resume::getIsActive)) {
            throw new IllegalStateException("Список резюме не является пустым.");
        }
    }

    private ResumeRequest updateFields(ResumeRequest persisted, ResumeRequest entity) {
        Optional.ofNullable(entity.getName()).ifPresent(persisted::setName);
        updateCompanyResponsibleRM(persisted, entity);
        Optional.ofNullable(entity.getStatus()).ifPresent(status -> {
            persisted.setStatus(status);
            persisted.setAutoDistribution(false);
        });
        Optional.ofNullable(entity.getDeadline()).ifPresent(persisted::setDeadline);
        Optional.ofNullable(entity.getPriority()).ifPresent(persisted::setPriority);
        Optional.ofNullable(entity.getOldId()).ifPresent(persisted::setOldId);
        Optional.ofNullable(entity.getResponsibleRM()).ifPresent(responsibleRM -> validateChangeResponsibleRm(persisted, responsibleRM));
        ResumeRequest savedRequest = resumeRequestRepository.saveAndFlush(persisted);
        updateCompanySale(persisted, entity, savedRequest);
        return persisted;
    }

    private void setResponsibleRM(ResumeRequest persisted, Employee responsible) {
        if (responsible.getId() == -1) {
            persisted.setResponsibleRM(null);
            persisted.setAutoDistribution(false);
            return;
        }

        Employee responsibleRM = employeeRepository.findById(responsible.getId());
        if (Boolean.TRUE.equals(responsibleRM.getResponsibleRM()) && persisted.isAutoDistribution()) {
            Company resumeRequestCompany = companyRepository.findOne(persisted.getCompany().getId());
            resumeRequestCompany.setResponsible(responsibleRM);
            companyRepository.saveAndFlush(resumeRequestCompany);
            persisted.setResponsibleRM(responsibleRM);
            responsibleRM.setDistributionDateRm(LocalDateTime.now());
        } else {
            persisted.setResponsibleRM(responsibleRM);
        }

        persisted.setAutoDistribution(false);
    }

    private boolean saleExistInCompanySales(CompanySale companySale, List<CompanySale> companySales) {
        return companySales.stream()
                .map(CompanySale::getId)
                .anyMatch(sale -> sale.equals(companySale.getId()));
    }

    private String getPrefixId(ResumeRequest resumeRequest) {
        return STORAGE_CATALOG + "/" + resumeRequest.getId();
    }

    private void updateFileListData(List<File> fileList, ResumeRequest resumeRequest) {
        fileList.forEach(file -> {
            file.setSaleRequest(resumeRequest);
            file.setUploadedBy(resumeRequest.getAuthor());
        });
    }

    private void updateCompanyResponsibleRM(ResumeRequest persisted, ResumeRequest entity) {
        Optional.ofNullable(entity.getCompany()).ifPresent(company -> {
            Company companyToUpdate = companyRepository.findOne(company.getId());
            if (!persisted.isAutoDistribution() &&
                    !persisted.getCompany().getId().equals(companyToUpdate.getId())) {
                if (companyToUpdate.getResponsible() == null && persisted.getResponsibleRM().getResponsibleRM()) {
                    companyToUpdate.setResponsible(persisted.getResponsibleRM());
                    companyRepository.saveAndFlush(companyToUpdate);
                } else {
                    persisted.setResponsibleRM(companyToUpdate.getResponsible());
                }
            }
            persisted.setCompany(company);
        });
    }

    private void updateCompanySale(ResumeRequest persisted, ResumeRequest entity, ResumeRequest savedRequest) {
        Optional.ofNullable(entity.getCompanySale()).ifPresent(sale -> {
            if (sale.getId() == -1) {
                persisted.setCompanySale(null);
            } else {
                if (saleExistInCompanySales(sale, savedRequest.getCompany().getCompanySales())) {
                    persisted.setCompanySale(sale);
                } else {
                    throw new CrmException("Нельзя привязывать запросы от одной компании к продажам другой компании");
                }
            }
        });
    }

    private void updateCompanySaleStatus(ResumeRequest resumeRequest) {
        CompanySale targetSale = resumeRequest.getCompanySale();
        if (targetSale.getStatus() != CompanySale.Status.ARCHIVE
                && targetSale.getStatus() != CompanySale.Status.CONTRACT) {
            targetSale.setStatus(CompanySale.Status.OPPORTUNITY);
            googleAdRecordService.updateRecordOnSaleStatusChanged(targetSale);
        }
    }

    private void updateDistribution(ResumeRequest resumeRequest) {
        Employee autoEmployee = autoResponsibleRmService.autoResponsibleRmEmployee();
        if (!ObjectUtils.isEmpty(autoEmployee)) {
            resumeRequest.setResponsibleRM(autoEmployee);
            resumeRequest.setFirstResponsibleRm(autoEmployee);
            autoEmployee.setDistributionDateRm(LocalDateTime.now());
            resumeRequest.setAutoDistribution(TRUE);
        } else {
            resumeRequest.setAutoDistribution(FALSE);
        }
    }
}
