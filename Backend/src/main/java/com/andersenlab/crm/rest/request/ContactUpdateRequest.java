package com.andersenlab.crm.rest.request;

import com.andersenlab.crm.model.Sex;
import com.andersenlab.crm.rest.deserializers.OptionalFieldDeserializer;
import com.andersenlab.crm.rest.deserializers.PhoneDeserializer;
import com.andersenlab.crm.rest.deserializers.WhiteSpaceRemovalDeserializer;
import com.andersenlab.crm.validation.NullOrNotBlank;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.Data;


@Data
public class ContactUpdateRequest {

    @NullOrNotBlank
    @JsonDeserialize(using = WhiteSpaceRemovalDeserializer.class)
    private String firstName;

    @NullOrNotBlank
    @JsonDeserialize(using = OptionalFieldDeserializer.class)
    private String lastName;

    @NullOrNotBlank
    @JsonDeserialize(using = OptionalFieldDeserializer.class)
    private String skype;

    @NullOrNotBlank
    @JsonDeserialize(using = OptionalFieldDeserializer.class)
    private String position;

    @NullOrNotBlank
    @JsonDeserialize(using = OptionalFieldDeserializer.class)
    private String personalEmail;

    private Long countryId;

    @NullOrNotBlank
    @JsonDeserialize(using = PhoneDeserializer.class)
    private String phone;

    @NullOrNotBlank
    @JsonDeserialize(using = OptionalFieldDeserializer.class)
    private String email;

    @NullOrNotBlank
    @JsonDeserialize(using = OptionalFieldDeserializer.class)
    private String socialNetwork;

    private Long socialNetworkUserId;

    private Boolean isActive;

    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private Sex sex;

    @NullOrNotBlank
    private String dateOfBirth;
}
