package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.rest.response.RatingNCForNCResponse;
import com.andersenlab.crm.rest.response.RatingNCResponse;
import org.springframework.stereotype.Component;

@Component
public class RatingNCResponseToRatingNCForNCResponseConverter
        implements Converter<RatingNCResponse, RatingNCForNCResponse> {
    @Override
    public RatingNCForNCResponse convert(RatingNCResponse source) {
        RatingNCForNCResponse target = new RatingNCForNCResponse();
        target.setAssistantId(source.getAssistantId());
        target.setAssistantName(source.getAssistantName());
        target.setAmount(source.getAmount());
        target.setApply(source.getApply());
        return target;
    }

    @Override
    public Class<RatingNCResponse> getSource() {
        return RatingNCResponse.class;
    }

    @Override
    public Class<RatingNCForNCResponse> getTarget() {
        return RatingNCForNCResponse.class;
    }
}
