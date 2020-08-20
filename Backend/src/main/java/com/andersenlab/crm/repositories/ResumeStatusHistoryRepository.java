package com.andersenlab.crm.repositories;

import com.andersenlab.crm.model.entities.Resume;
import com.andersenlab.crm.model.entities.ResumeStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface ResumeStatusHistoryRepository extends JpaRepository <ResumeStatusHistory, Long> {

  ResumeStatusHistory findFirstByResumeOrderByStatusStartedDesc(Resume resume);

  List<ResumeStatusHistory> findAllByResumeIdInOrderByStatusStarted(Collection<Long> resumeId);
  void deleteByResume(Resume resume);

}
