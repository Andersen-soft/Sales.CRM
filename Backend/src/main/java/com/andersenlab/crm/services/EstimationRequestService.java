package com.andersenlab.crm.services;

import com.andersenlab.crm.model.entities.EstimationRequest;
import com.andersenlab.crm.model.entities.File;
import com.andersenlab.crm.rest.request.EstimationRequestCreate;
import com.andersenlab.crm.rest.request.EstimationRequestUpdate;
import com.querydsl.core.types.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * @author Yevhenii Pshenychnyi
 */
public interface EstimationRequestService {

    EstimationRequest createRequest(EstimationRequestCreate request, MultipartFile[] files);

    EstimationRequest create(EstimationRequest request);

    void updateRequest(Long id, EstimationRequestUpdate request);

    EstimationRequest updateRequest(EstimationRequest request);

    void deleteRequest(Long id);

    EstimationRequest getActiveRequestById(Long id);

    /**
     * Retrieves all estimation requests, filtered by EstimationRequestFilter properties
     */
    Page<EstimationRequest> getRequestsWithFilter(Predicate predicate, Pageable pageable);

    Page<EstimationRequest> getRequestsWithFilterForReport(Predicate predicate, Pageable pageable);

    Page<EstimationRequest> getNotTiedToSalesRequestsWithFilter(Predicate predicate, Pageable pageable);

    List<String> getStatuses();

    File attacheFile(Long id, MultipartFile file);

    List<File> attachMultipleFiles(Long id, List<MultipartFile> files);

    void detachFile(Long estimationId, Long idFile);

    File attachEstimation(Long id, MultipartFile file);

    void detachEstimation(Long estimationId, Long idFile);

    EstimationRequest findRequestByIdOrThrow(Long id);

    void attachToSale(Long id, Long companySaleId);

    void detachToSale(Long id);

    EstimationRequest findOne(Predicate predicate);

    void validateById(Long id);

    EstimationRequest getByOldId(Long oldId);

    Page<File> getFiles(Pageable pageable, Long id);
}
