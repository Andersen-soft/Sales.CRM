package com.andersenlab.crm.rest.facade;

import com.andersenlab.crm.rest.BaseResponse;
import com.andersenlab.crm.rest.dto.EstimationRequestOldDto;

public interface EstimationRequestFacade {

    BaseResponse createOldRequest(EstimationRequestOldDto json);

    BaseResponse updateOldRequest(EstimationRequestOldDto json);
}
