package com.andersenlab.crm.repositories;

import com.andersenlab.crm.model.entities.ResumeHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ResumeHistoryRepository extends JpaRepository<ResumeHistory, Long> {

    @Query("select history from ResumeHistory history " +
            "join history.resume resume " +
            "join resume.resumeRequest request " +
            "where request.id = :requestId")
    List<ResumeHistory> findAllResumeHistoryByResumeRequestId(@Param("requestId") Long requestId);
}
