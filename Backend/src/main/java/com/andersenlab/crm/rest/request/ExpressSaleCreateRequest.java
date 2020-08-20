package com.andersenlab.crm.rest.request;

import com.andersenlab.crm.rest.deserializers.PhoneDeserializer;
import com.andersenlab.crm.rest.deserializers.WhiteSpaceRemovalDeserializer;
import com.andersenlab.crm.validation.NullOrNotBlank;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.Data;

import javax.validation.constraints.Email;

@Data
public class ExpressSaleCreateRequest {

    @NullOrNotBlank
    @JsonDeserialize(using = WhiteSpaceRemovalDeserializer.class)
    String name;

    @NullOrNotBlank
    @Email
    @JsonDeserialize(using = WhiteSpaceRemovalDeserializer.class)
    String mail;

    @NullOrNotBlank
    @JsonDeserialize(using = PhoneDeserializer.class)
    String phone;

    Long responsibleId;

    //    @NotNull
    Long countryId;

    @NullOrNotBlank
    @JsonDeserialize(using = WhiteSpaceRemovalDeserializer.class)
    String description;
}
