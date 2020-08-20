package com.andersenlab.crm.rest.facade;

import com.andersenlab.crm.rest.request.SourceCreateRequest;
import com.andersenlab.crm.rest.response.SourceResponse;

public interface SourceFacade {
    SourceResponse create(SourceCreateRequest request);
}
