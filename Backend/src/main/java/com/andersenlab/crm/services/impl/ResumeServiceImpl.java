package com.andersenlab.crm.services.impl;

import com.andersenlab.crm.events.ResumeCreatedEvent;
import com.andersenlab.crm.events.ResumeStatusChangedEvent;
import com.andersenlab.crm.exceptions.CrmException;
import com.andersenlab.crm.exceptions.ResourceNotFoundException;
import com.andersenlab.crm.model.entities.File;
import com.andersenlab.crm.model.entities.Resume;
import com.andersenlab.crm.model.entities.ResumeRequest;
import com.andersenlab.crm.model.entities.ResumeStatusHistory;
import com.andersenlab.crm.repositories.FileRepository;
import com.andersenlab.crm.repositories.ResumeRepository;
import com.andersenlab.crm.repositories.ResumeRequestRepository;
import com.andersenlab.crm.repositories.ResumeStatusHistoryRepository;
import com.andersenlab.crm.security.AuthenticatedUser;
import com.andersenlab.crm.services.FileUploaderHelper;
import com.andersenlab.crm.services.ResumeRequestService;
import com.andersenlab.crm.services.ResumeService;
import com.querydsl.core.types.Predicate;
import lombok.AllArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Implementation of ResumeService interface
 *
 * @see ResumeService
 */
@Service
@AllArgsConstructor
public class ResumeServiceImpl implements ResumeService {

    private static final String STORAGE_CATALOG = "resume";

    /**
     * Provides crud methods for accessing resumes
     */
    private final ResumeRepository resumeRepository;
    private final FileUploaderHelper fileUploaderHelper;
    private final FileRepository fileRepository;
    private final ResumeRequestService resumeRequestService;
    private final ResumeRequestRepository resumeRequestRepository;
    private final AuthenticatedUser authenticatedUser;
    private final ApplicationEventPublisher eventPublisher;
    private final ResumeStatusHistoryRepository resumeStatusHistoryRepository;

    @Override
    @Transactional
    public Resume createResume(Resume resume, MultipartFile[] files) {
        Resume persisted = resumeRepository.saveAndFlush(resume);
        addResumeStatusHistory(persisted);
        ResumeRequest resumeRequest = resumeRequestService.findRequestByIdOrThrow(persisted.getResumeRequest().getId());

        if (!resumeRequest.isAutoDistribution()) {
            List<File> fileList = fileUploaderHelper.uploadFilesAndGetEntities(getPrefixId(persisted), files);
            updateFileListData(fileList, persisted);
            persisted.setFiles(fileList);

            resumeRequest.setStatus(ResumeRequest.Status.IN_PROGRESS);
            resumeRequestRepository.saveAndFlush(resumeRequest);
            resumeRequestService.setDoneDateOrNull(resumeRequest);

            persisted = resumeRepository.saveAndFlush(persisted);

            eventPublisher.publishEvent(ResumeCreatedEvent
                    .builder()
                    .resumeId(persisted.getId())
                    .build());

            return persisted;
        } else {
            throw new CrmException("Applicant cannot be added to the request while being distributed");
        }
    }

    @Override
    @Transactional
    public Resume updateResume(Long id, Resume entity) {
        Resume persisted = getResumeById(id);

        Resume.Status newStatus = entity.getStatus();

        boolean isUpdatable = isUpdatableResumeStatus(persisted, newStatus);
        if (isUpdatable) {
            persisted.setStatusChangedDate(LocalDateTime.now());
            eventPublisher.publishEvent(ResumeStatusChangedEvent.builder()
                    .newStatus(newStatus)
                    .resumeId(persisted.getId())
                    .build());
        }

        Resume updated = updateResumeFields(persisted, entity);
        resumeRequestService.setDoneDateOrNull(updated.getResumeRequest());
        Resume resume = resumeRepository.saveAndFlush(updated);
        if (isUpdatable) {
            addResumeStatusHistory(updated);
        }

        return resume;
    }

    private void addResumeStatusHistory(Resume resume) {
        ResumeStatusHistory resumeStatusHistory = new ResumeStatusHistory();
        resumeStatusHistory.setStatusName(resume.getStatus().getName());
        resumeStatusHistory.setStatusStarted(LocalDateTime.now());
        resumeStatusHistory.setResume(resume);
        ResumeStatusHistory previousResumeStatusHistory = findPreviousStatus(resume);
        if (previousResumeStatusHistory != null) {
            long previousStatusDuration = Duration.between(previousResumeStatusHistory.getStatusStarted(), LocalDateTime.now()).getSeconds();
            previousResumeStatusHistory.setStatusDuration(previousStatusDuration);
            resumeStatusHistoryRepository.saveAndFlush(previousResumeStatusHistory);
        }
        resumeStatusHistoryRepository.saveAndFlush(resumeStatusHistory);
    }

    private ResumeStatusHistory findPreviousStatus(Resume resume) {
        return resumeStatusHistoryRepository.findFirstByResumeOrderByStatusStartedDesc(resume);
    }

    public Resume updateResumeFields(Resume persisted, Resume entity) {
        Optional.ofNullable(entity.getResponsibleHr()).ifPresent(responsibleRm -> {
            if (responsibleRm.getId() == -1) {
                persisted.setResponsibleHr(null);
            } else {
                persisted.setResponsibleHr(responsibleRm);
            }
        });
        Optional.ofNullable(entity.getFio()).ifPresent(persisted::setFio);
        Optional.ofNullable(entity.getHrComment()).ifPresent(persisted::setHrComment);
        if (entity.getStatus() == Resume.Status.HR_NEED && persisted.getStatus() == Resume.Status.CTO_NEED
                || entity.getStatus() == Resume.Status.IN_PROGRESS && persisted.getStatus() == Resume.Status.CTO_NEED
        ) {
            Long returnsResumeCount = persisted.getReturnsResumeCount();
            persisted.setReturnsResumeCount(++returnsResumeCount);
        }
        Optional.ofNullable(entity.getStatus()).ifPresent(persisted::setStatus);
        Optional.ofNullable(entity.getIsUrgent()).ifPresent(persisted::setIsUrgent);
        return persisted;
    }

    @Override
    public Resume getResumeById(Long id) {
        return Optional.ofNullable(resumeRepository.findByIsActiveIsTrueAndId(id))
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found"));
    }

    @Override
    public Page<Resume> getResumeWithFilter(Predicate predicate, Pageable pageable) {
        return resumeRepository.findAll(predicate, pageable);
    }

    @Override
    @Transactional
    public void deleteResume(Long id) {
        Resume one = getResumeById(id);
        one.getFiles().stream().map(File::getId).forEach(fileUploaderHelper::deleteFileFromAmazonById);
        one.setIsActive(false);
        resumeStatusHistoryRepository.deleteByResume(one);
        resumeRepository.saveAndFlush(one);
    }

    @Override
    public File attachFileToResume(Long id, MultipartFile file) {
        Resume resume = getResumeById(id);
        File entityFile = fileUploaderHelper.uploadFileAndGetEntity(STORAGE_CATALOG, file);
        entityFile.setSaleObject(resume);
        entityFile.setUploadedBy(authenticatedUser.getCurrentEmployee());
        return fileRepository.save(entityFile);
    }

    @Override
    public void detachFileFromResume(Long idFile) {
        fileUploaderHelper.deleteFileById(idFile);
    }

    private String getPrefixId(Resume resume) {
        return STORAGE_CATALOG + "/" + resume.getId();
    }

    private void updateFileListData(List<File> fileList, Resume resume) {
        fileList.forEach(file -> {
            file.setSaleObject(resume);
            file.setUploadedBy(resume.getAuthor());
        });
    }

    @Override
    public void validateById(Long id) {
        if (!resumeRepository.existsById(id)) {
            throw new CrmException("Резюме с id = " + id + " не найдена");
        }
    }

    @Override
    public boolean exists(Predicate predicate) {
        return resumeRepository.exists(predicate);
    }

    private boolean isUpdatableResumeStatus(Resume persisted, Resume.Status newStatus) {
        return newStatus != null && !persisted.getStatus().equals(newStatus);
    }
}
