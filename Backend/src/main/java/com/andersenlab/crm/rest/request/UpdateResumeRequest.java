package com.andersenlab.crm.rest.request;

import com.andersenlab.crm.aop.HasRole;
import com.andersenlab.crm.rest.deserializers.OptionalFieldDeserializer;
import com.andersenlab.crm.validation.NullOrNotBlank;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.Data;

import static com.andersenlab.crm.model.RoleEnum.*;

@Data
public class UpdateResumeRequest {

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_RM})
    @NullOrNotBlank
    @JsonDeserialize(using = OptionalFieldDeserializer.class)
    private String candidateInfo;

    @HasRole(roles = {ROLE_HR})
    private Long responsibleId;

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_RM, ROLE_MANAGER, ROLE_SALES})
    private Long ratingId;

    @NullOrNotBlank
    @HasRole(roles = {ROLE_HR, ROLE_RM})
    private String status;

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_RM, ROLE_MANAGER, ROLE_SALES})
    private Boolean isActive;

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_HR, ROLE_RM, ROLE_MANAGER, ROLE_SALES})
    @NullOrNotBlank
    @JsonDeserialize(using = OptionalFieldDeserializer.class)
    private String hrComment;
}
