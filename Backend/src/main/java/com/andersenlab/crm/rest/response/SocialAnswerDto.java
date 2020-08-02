package com.andersenlab.crm.rest.response;

import com.andersenlab.crm.model.Sex;
import com.andersenlab.crm.rest.request.IndustryCreateRequest;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class SocialAnswerDto {

    private Long id;
    private LocalDateTime created;
    @Null
    @JsonProperty("assistant")
    private EmployeeDto assistant;
    @Null
    @JsonProperty("responsible")
    private EmployeeDto responsibleDto;
    @Null
    @JsonProperty("source")
    private SourceDto sourceDto;
    @Null
    @JsonProperty("contact")
    private ContactDto contactDto;
    @NotBlank
    private String message;
    @NotBlank
    private String linkLead;
    @NotBlank
    private String firstName;
    @NotBlank
    private String lastName;
    @NotNull
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private Sex sex;
    private String position;
    @NotNull
    @JsonProperty("country")
    private CountryDto countryDto;
    private String skype;
    private String email;
    private String emailPrivate;
    private String phone;
    private String dateOfBirth;
    @NotNull
    @JsonProperty("company")
    private CompanySocialAnswerDto companyDto;
    private List<IndustryCreateRequest> industryCreateRequestList;
}
