package com.andersenlab.crm.services;

import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.model.entities.File;
import com.andersenlab.crm.model.entities.Resume;
import com.querydsl.core.types.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

/**
 * Encapsulates business logic and persistence related to resumes and saleObjectId requests.
 *
 * @see Employee
 */
public interface ResumeService {
    /**
     * Saves a given saleObjectId
     *
     * @param resume the saleObjectId to save
     * @param files the files attached to resume
     */
    Resume createResume(Resume resume, MultipartFile[] files);

    /**
     * Updates the saleObjectId with the given id
     */
    Resume updateResume(Long id, Resume entity);

    /**
     * Retrieves a saleObjectId by its id.
     *
     * @param id the identification of saleObjectId to retrieve
     * @return the saleObjectId with the given id
     */
    Resume getResumeById(Long id);

    Page<Resume> getResumeWithFilter(Predicate predicate, Pageable pageable);

    /**
     * Deletes the saleObjectId with the given id
     *
     * @param id the identification of saleObjectId to delete
     */
    void deleteResume(Long id);

    File attachFileToResume(Long id, MultipartFile file);

    void detachFileFromResume(Long idFile);

    void validateById(Long id);

    boolean exists(Predicate predicate);

}
