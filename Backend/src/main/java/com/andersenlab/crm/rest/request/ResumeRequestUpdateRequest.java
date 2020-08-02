package com.andersenlab.crm.rest.request;

import static com.andersenlab.crm.model.RoleEnum.ROLE_HR;
import static com.andersenlab.crm.model.RoleEnum.ROLE_MANAGER;
import static com.andersenlab.crm.model.RoleEnum.ROLE_RM;
import static com.andersenlab.crm.model.RoleEnum.ROLE_SALES;
import static com.andersenlab.crm.model.RoleEnum.ROLE_SALES_HEAD;

import com.andersenlab.crm.aop.HasRole;
import com.andersenlab.crm.aop.ResponsibleFor;
import com.andersenlab.crm.model.entities.ResumeRequest;
import com.andersenlab.crm.validation.FutureDateTime;
import com.andersenlab.crm.validation.NullOrNotBlank;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * Contains saleObjectId request information to update
 */
@Data
public class ResumeRequestUpdateRequest {

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_MANAGER, ROLE_RM, ROLE_SALES},
            responsibleFor = @ResponsibleFor(entityClass = ResumeRequest.class))
    @NullOrNotBlank
    private String name;

    @FutureDateTime
    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_MANAGER, ROLE_RM, ROLE_SALES},
            responsibleFor = @ResponsibleFor(entityClass = ResumeRequest.class))
    private LocalDateTime deadLine;

    @FutureDateTime
    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_MANAGER, ROLE_RM, ROLE_SALES},
            responsibleFor = @ResponsibleFor(entityClass = ResumeRequest.class))
    private LocalDateTime startAt;

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_MANAGER, ROLE_RM, ROLE_SALES},
            responsibleFor = @ResponsibleFor(entityClass = ResumeRequest.class))
    private Boolean isActive;

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_MANAGER, ROLE_RM, ROLE_SALES},
            responsibleFor = @ResponsibleFor(entityClass = ResumeRequest.class))
    @NullOrNotBlank
    private String priority;

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_MANAGER, ROLE_RM, ROLE_SALES},
            responsibleFor = @ResponsibleFor(entityClass = ResumeRequest.class))
    @NullOrNotBlank
    private String status;

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_MANAGER, ROLE_RM, ROLE_SALES},
            responsibleFor = @ResponsibleFor(entityClass = ResumeRequest.class))
    private Long responsibleForRequestId;

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_MANAGER, ROLE_RM, ROLE_SALES},
            responsibleFor = @ResponsibleFor(entityClass = ResumeRequest.class))
    private Long responsibleRmId;

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_HR, ROLE_MANAGER, ROLE_RM, ROLE_SALES})
    private Boolean isFavorite;

    private Long companySalesId;
}
