package com.andersenlab.crm.repositories;

import com.andersenlab.crm.model.entities.ResumeRequestHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ResumeRequestHistoryRepository extends JpaRepository<ResumeRequestHistory, Long> {

    @Query("select history from ResumeRequestHistory history " +
            "join history.resumeRequest request " +
            "where request.id = :requestId")
    List<ResumeRequestHistory> findAllByResumeRequestId(@Param("requestId") Long requestId);

    Page<ResumeRequestHistory> findByResumeRequestId(Pageable pageable, Long resumeRequestId);
}
