package com.andersenlab.crm.rest.response;

import com.andersenlab.crm.rest.sample.EmployeeSample;
import lombok.Data;

import java.util.List;
import java.util.Set;

/**
 * Contains employee information.
 */
@Data
public class EmployeeResponse {
    private Long id;
    private String login;
    private Boolean isActive;
    private Set<RoleResponse> roles;
    private Set<CountryDto> countries;
    private String firstName;
    private String lastName;
    private String email;
    private List<String> additionalEmails;
    private String skype;
    private String phone;
    private String additionalInfo;
    private String position;
    private String telegramUsername;
    private Boolean isLdapUser;
    private boolean lotteryParticipantDay;
    private boolean lotteryParticipantNight;
    private boolean lotteryParticipantRegional;
    private Boolean hasActivities;
    private EmployeeSample mentor;
    private boolean responsibleRM;
    private String employeeLang;
}
