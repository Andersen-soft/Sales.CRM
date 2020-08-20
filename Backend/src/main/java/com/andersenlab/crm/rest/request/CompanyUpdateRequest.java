package com.andersenlab.crm.rest.request;

import com.andersenlab.crm.rest.deserializers.OptionalFieldDeserializer;
import com.andersenlab.crm.rest.deserializers.PhoneDeserializer;
import com.andersenlab.crm.rest.deserializers.WhiteSpaceRemovalDeserializer;
import com.andersenlab.crm.validation.NullOrNotBlank;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.Data;

import java.util.List;

@Data
public class CompanyUpdateRequest {

    @NullOrNotBlank
    @JsonDeserialize(using = WhiteSpaceRemovalDeserializer.class)
    private String name;

    @NullOrNotBlank
    @JsonDeserialize(using = OptionalFieldDeserializer.class)
    private String url;

    @NullOrNotBlank
    @JsonDeserialize(using = PhoneDeserializer.class)
    private String phone;

    @NullOrNotBlank
    @JsonDeserialize(using = OptionalFieldDeserializer.class)
    private String description;

    private Long responsibleRmId;

    private List<IndustryCreateRequest> industryCreateRequestList;
}
