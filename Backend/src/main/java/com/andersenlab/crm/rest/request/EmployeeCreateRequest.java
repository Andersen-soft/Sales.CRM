package com.andersenlab.crm.rest.request;

import com.andersenlab.crm.aop.HasRole;
import com.andersenlab.crm.rest.deserializers.OptionalFieldDeserializer;
import com.andersenlab.crm.validation.NullOrNotBlank;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import java.util.List;

import static com.andersenlab.crm.model.RoleEnum.ROLE_ADMIN;

/**
 * Represents request for creating new employee
 */
@Data
public class EmployeeCreateRequest {

    @NotBlank
    @JsonDeserialize(using = OptionalFieldDeserializer.class)
    private String email;

    private List<String> additionalEmails;

    @NotBlank
    private String login;

    @NotBlank
    @JsonDeserialize(using = OptionalFieldDeserializer.class)
    private String firstName;

    @NotBlank
    @JsonDeserialize(using = OptionalFieldDeserializer.class)
    private String lastName;

    @NotEmpty
    private Long[] roles;

    @NullOrNotBlank
    @JsonDeserialize(using = OptionalFieldDeserializer.class)
    private String skype;

    @NullOrNotBlank
    @JsonDeserialize(using = OptionalFieldDeserializer.class)
    private String employeeLang;

    @NullOrNotBlank
    @JsonDeserialize(using = OptionalFieldDeserializer.class)
    private String position;

    @NullOrNotBlank
    @JsonDeserialize(using = OptionalFieldDeserializer.class)
    private String additionalInfo;

    @HasRole(roles = ROLE_ADMIN)
    private Boolean lotteryParticipantDay;

    @HasRole(roles = ROLE_ADMIN)
    private Boolean lotteryParticipantNight;

    @HasRole(roles = ROLE_ADMIN)
    private Boolean lotteryParticipantRegional;

    private Boolean responsibleRM;

    private String telegramUsername;

    private Long mentorId;

    private List<Long> countryId;
}
