package com.andersenlab.crm.rest.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegionApiDto {
    @JsonProperty
    private String ipAddress;
    @JsonProperty
    private String continentCode;
    @JsonProperty
    private String continentName;
    @JsonProperty
    private String countryCode;
    @JsonProperty
    private String countryName;
    @JsonProperty
    private String stateProv;
    @JsonProperty
    private String city;
}
