package com.andersenlab.crm.rest.response;


import com.andersenlab.crm.convertservice.ConvertClass;


@ConvertClass
public interface RatingNCResponse {

    Long getAssistantId();

    String getAssistantName();

    Long getAmount();

    Long getApply();

    Long getReject();

    Long getAwait();

}
