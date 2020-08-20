package com.andersenlab.crm.repositories;

import com.andersenlab.crm.model.entities.QResume;
import com.andersenlab.crm.model.entities.Resume;

public interface ResumeRepository extends BaseRepository<QResume, Resume, Long> {
    boolean existsById(Long id);

    Resume findByIsActiveIsTrueAndId(Long id);
}
