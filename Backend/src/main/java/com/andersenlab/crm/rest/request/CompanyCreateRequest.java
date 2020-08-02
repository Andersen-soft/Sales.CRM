package com.andersenlab.crm.rest.request;

import com.andersenlab.crm.rest.deserializers.PhoneDeserializer;
import com.andersenlab.crm.rest.deserializers.WhiteSpaceRemovalDeserializer;
import com.andersenlab.crm.validation.NullOrNotBlank;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.Data;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import java.util.List;

@Data
public class CompanyCreateRequest {

    @NotBlank
    @JsonDeserialize(using = WhiteSpaceRemovalDeserializer.class)
    private String name;

    @NullOrNotBlank
    @JsonDeserialize(using = WhiteSpaceRemovalDeserializer.class)
    private String url;

    @NullOrNotBlank
    @JsonDeserialize(using = PhoneDeserializer.class)
    private String phone;

    @NullOrNotBlank
    @JsonDeserialize(using = WhiteSpaceRemovalDeserializer.class)
    private String description;

    private Long contactId;

    @Valid
    private ContactCreateRequest contact;

    private List<IndustryCreateRequest> industryCreateRequestList;
}
