package com.andersenlab.crm.rest.request;

import com.andersenlab.crm.model.Sex;
import com.andersenlab.crm.rest.deserializers.PhoneDeserializer;
import com.andersenlab.crm.rest.deserializers.WhiteSpaceRemovalDeserializer;
import com.andersenlab.crm.validation.NullOrNotBlank;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;

@Data
public class ContactCreateRequest {

    private Long companyId;

    @NotBlank
    @JsonDeserialize(using = WhiteSpaceRemovalDeserializer.class)
    private String firstName;

    @NullOrNotBlank
    @JsonDeserialize(using = WhiteSpaceRemovalDeserializer.class)
    private String lastName;

    @NullOrNotBlank
    @JsonDeserialize(using = WhiteSpaceRemovalDeserializer.class)
    private String position;

    @NullOrNotBlank
    @JsonDeserialize(using = WhiteSpaceRemovalDeserializer.class)
    private String email;

    @NullOrNotBlank
    @JsonDeserialize(using = WhiteSpaceRemovalDeserializer.class)
    private String skype;

    private String socialNetwork;

    private Long socialNetworkUserId;

    @NullOrNotBlank
    @JsonDeserialize(using = PhoneDeserializer.class)
    private String contactPhone;

    private Long countryId;

    private Long sourceId;

    @JsonDeserialize(using = WhiteSpaceRemovalDeserializer.class)
    private String personalEmail;

    @NotNull
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private Sex sex;
    
    private Long recommendationId;

    @JsonProperty("mainContact")
    private Boolean mainContact;

    private Long saleId;

    private LocalDate dateOfBirth;
}
