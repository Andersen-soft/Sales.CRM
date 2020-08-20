package com.andersenlab.crm.repositories;

import com.andersenlab.crm.model.entities.EstimationRequestHistory;
import com.andersenlab.crm.model.entities.History;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EstimationRequestHistoryRepository extends JpaRepository<EstimationRequestHistory, Long> {

    @Query("select history from EstimationRequestHistory history " +
            "join history.estimationRequest request " +
            "where request.id = :requestId")
    Page<History> findAllByEstimationRequestId(@Param("requestId") Long requestId, Pageable pageable);
}
