package com.andersenlab.crm.rest.request;

import com.andersenlab.crm.aop.HasRole;
import com.andersenlab.crm.aop.ResponsibleFor;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.rest.deserializers.OptionalFieldDeserializer;
import com.andersenlab.crm.validation.NullOrNotBlank;
import com.andersenlab.crm.validation.NullOrNotEmpty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

import static com.andersenlab.crm.model.RoleEnum.ROLE_ADMIN;
import static com.andersenlab.crm.model.RoleEnum.ROLE_HR;
import static com.andersenlab.crm.model.RoleEnum.ROLE_MANAGER;
import static com.andersenlab.crm.model.RoleEnum.ROLE_NETWORK_COORDINATOR;
import static com.andersenlab.crm.model.RoleEnum.ROLE_RM;
import static com.andersenlab.crm.model.RoleEnum.ROLE_SALES;
import static com.andersenlab.crm.model.RoleEnum.ROLE_SALES_HEAD;

/**
 * Contains employee information to update
 */
@Data
public class EmployeeUpdateRequest {
    @NullOrNotEmpty
    @HasRole(roles = ROLE_ADMIN)
    private Long[] roles;

    @HasRole(roles = ROLE_ADMIN)
    private List<Long> countries;

    @HasRole(roles = ROLE_ADMIN)
    private Boolean cleanCountries;

    @NullOrNotBlank
    @JsonDeserialize(using = OptionalFieldDeserializer.class)
    @HasRole(roles = {ROLE_ADMIN, ROLE_SALES_HEAD, ROLE_HR, ROLE_MANAGER, ROLE_RM, ROLE_SALES, ROLE_NETWORK_COORDINATOR},
            responsibleFor = @ResponsibleFor(entityClass = Employee.class))
    private String additionalInfo;

    @NullOrNotBlank
    @JsonDeserialize(using = OptionalFieldDeserializer.class)
    @HasRole(roles = ROLE_ADMIN)
    private String email;

    @HasRole(roles = ROLE_ADMIN)
    private List<String> additionalEmails;

    @NullOrNotBlank
    @JsonDeserialize(using = OptionalFieldDeserializer.class)
    @HasRole(roles = {ROLE_ADMIN, ROLE_SALES_HEAD, ROLE_HR, ROLE_MANAGER, ROLE_RM, ROLE_SALES, ROLE_NETWORK_COORDINATOR},
            responsibleFor = @ResponsibleFor(entityClass = Employee.class))
    private String firstName;

    @NullOrNotBlank
    @JsonDeserialize(using = OptionalFieldDeserializer.class)
    @HasRole(roles = ROLE_ADMIN)
    private String phone;

    @NullOrNotBlank
    @JsonDeserialize(using = OptionalFieldDeserializer.class)
    @HasRole(roles = {ROLE_ADMIN, ROLE_SALES_HEAD, ROLE_HR, ROLE_MANAGER, ROLE_RM, ROLE_SALES, ROLE_NETWORK_COORDINATOR},
            responsibleFor = @ResponsibleFor(entityClass = Employee.class))
    private String lastName;

    @NullOrNotBlank
    @JsonDeserialize(using = OptionalFieldDeserializer.class)
    @HasRole(roles = {ROLE_ADMIN, ROLE_SALES_HEAD, ROLE_HR, ROLE_MANAGER, ROLE_RM, ROLE_SALES, ROLE_NETWORK_COORDINATOR},
            responsibleFor = @ResponsibleFor(entityClass = Employee.class))
    private String skype;

    @NullOrNotBlank
    @JsonDeserialize(using = OptionalFieldDeserializer.class)
    @HasRole(roles = {ROLE_ADMIN, ROLE_SALES_HEAD, ROLE_HR, ROLE_MANAGER, ROLE_RM, ROLE_SALES, ROLE_NETWORK_COORDINATOR},
            responsibleFor = @ResponsibleFor(entityClass = Employee.class))
    private String employeeLang;

    @NullOrNotBlank
    @JsonDeserialize(using = OptionalFieldDeserializer.class)
    @HasRole(roles = {ROLE_ADMIN, ROLE_SALES_HEAD, ROLE_HR, ROLE_MANAGER, ROLE_RM, ROLE_SALES, ROLE_NETWORK_COORDINATOR},
            responsibleFor = @ResponsibleFor(entityClass = Employee.class))
    private String telegramUsername;

    @NullOrNotBlank
    @JsonDeserialize(using = OptionalFieldDeserializer.class)
    @HasRole(roles = ROLE_ADMIN)
    private String login;

    @NullOrNotBlank
    @JsonDeserialize(using = OptionalFieldDeserializer.class)
    @HasRole(roles = {ROLE_ADMIN, ROLE_SALES_HEAD, ROLE_HR, ROLE_MANAGER, ROLE_RM, ROLE_SALES, ROLE_NETWORK_COORDINATOR},
            responsibleFor = @ResponsibleFor(entityClass = Employee.class))
    private String position;

    @HasRole(roles = ROLE_ADMIN)
    private Boolean isActive;

    @HasRole(roles = ROLE_ADMIN)
    private LocalDateTime autoDistributionDate;

    @HasRole(roles = ROLE_ADMIN)
    private Boolean lotteryParticipantDay;

    @HasRole(roles = ROLE_ADMIN)
    private Boolean lotteryParticipantNight;

    @HasRole(roles = ROLE_ADMIN)
    private Boolean lotteryParticipantRegional;

    @HasRole(roles = ROLE_ADMIN)
    private Boolean responsibleRM;

    @HasRole(roles = {ROLE_ADMIN, ROLE_SALES_HEAD, ROLE_SALES},
            responsibleFor = @ResponsibleFor(entityClass = Employee.class))
    private Long mentorId;
}
