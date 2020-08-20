package com.andersenlab.crm.rest.request;

import com.andersenlab.crm.aop.HasRole;
import lombok.Data;

import static com.andersenlab.crm.model.RoleEnum.*;

/**
 * Contains estimation request information to update
 *
 * @author Yevhenii Muzyka on 03.08.2018
 */
@Data
public class EstimationUpdateRequest {

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_MANAGER, ROLE_RM, ROLE_SALES})
    private Boolean isActive;

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_RM})
    private String estimator;

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_RM})
    private String workType;

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_MANAGER, ROLE_RM})
    private String status;
}
