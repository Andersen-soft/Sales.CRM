package com.andersenlab.crm.rest.dto;

import com.andersenlab.crm.model.Sex;
import com.andersenlab.crm.model.entities.Industry;
import com.andersenlab.crm.rest.deserializers.PhoneDeserializer;
import com.andersenlab.crm.rest.deserializers.WhiteSpaceRemovalDeserializer;
import com.andersenlab.crm.validation.NullOrNotBlank;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.Data;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

@Data
public class SocialAnswerDtoForm {

    private Long id;

    @NotNull
    private Long socialNetworkContactId;

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

    @NotNull
    private Long countryId;

    @NotBlank
    private String companyName;

    @NotBlank
    private String position;

    @NullOrNotBlank
    @Email
    @JsonDeserialize(using = WhiteSpaceRemovalDeserializer.class)
    private String emailCorporate;

    @NullOrNotBlank
    @Email
    @JsonDeserialize(using = WhiteSpaceRemovalDeserializer.class)
    private String emailPersonal;

    @NullOrNotBlank
    @JsonDeserialize(using = PhoneDeserializer.class)
    private String phone;

    @NullOrNotBlank
    @JsonDeserialize(using = WhiteSpaceRemovalDeserializer.class)
    private String skype;

    private LocalDate dateOfBirth;
    private List<Industry> industryDtos;
}
