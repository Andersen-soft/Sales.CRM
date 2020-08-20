package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.rest.response.RatingNCReportResponse;
import com.andersenlab.crm.rest.response.RatingNCResponse;
import org.springframework.stereotype.Component;

@Component
public class RatingNCResponseToRatingNCReportResponseConverter implements Converter<RatingNCResponse, RatingNCReportResponse> {

    @Override
    public RatingNCReportResponse convert(RatingNCResponse source) {
        RatingNCReportResponse target = new RatingNCReportResponse();
        target.setAssistantName(source.getAssistantName());
        target.setAmount(convertLongToString(source.getAmount()));
        target.setApply(convertLongToString(source.getApply()));
        target.setReject(convertLongToString(source.getReject()));
        target.setAwait(convertLongToString(source.getAwait()));
        return target;
    }

    private String convertLongToString(Long value) {
        return value == 0 ? "" : value.toString();
    }

    @Override
    public Class<RatingNCResponse> getSource() {
        return RatingNCResponse.class;
    }

    @Override
    public Class<RatingNCReportResponse> getTarget() {
        return RatingNCReportResponse.class;
    }
}
