package com.andersenlab.crm.rest.response;

import com.andersenlab.crm.rest.sample.EstimationCommentSample;
import com.andersenlab.crm.rest.sample.HistorySample;
import lombok.Data;

import java.util.List;

/**
 * Contains estimation information.
 *
 * @author Yevhenii Muzyka on 03.08.2018
 */
@Data
public class EstimationResponse {
    private Long id;
    private String estimator;
    private Boolean isActive;
    private List<EstimationCommentSample> commentList;
    private List<HistorySample> historyList;
    private String workType;
    private String status;
    private String fileLink;
}
