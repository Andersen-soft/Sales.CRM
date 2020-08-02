package com.andersenlab.crm.rest.request;

import com.andersenlab.crm.rest.deserializers.OptionalFieldDeserializer;
import com.andersenlab.crm.rest.deserializers.PhoneDeserializer;
import com.andersenlab.crm.rest.deserializers.WhiteSpaceRemovalDeserializer;
import com.andersenlab.crm.validation.NullOrNotBlank;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.Data;

import java.util.List;

@Data
public class CompanyFilterRequest {

    @NullOrNotBlank
    @JsonDeserialize(using = WhiteSpaceRemovalDeserializer.class)
    private String name;

    @NullOrNotBlank
    @JsonDeserialize(using = OptionalFieldDeserializer.class)
    private String url;

    @NullOrNotBlank
    @JsonDeserialize(using = PhoneDeserializer.class)
    private String phone;

    private Long responsibleRmId;

    /**
     * List of industry IDs to look for in specified companies.
     */
    private List<Long> industry;

    public boolean hasFilter() {
        boolean hasFilter = false;
        if (this.name != null || this.phone != null || this.url != null || this.responsibleRmId != null) {
            hasFilter = true;
        }
        return hasFilter;
    }
}
