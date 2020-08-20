package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.entities.Rating;
import com.andersenlab.crm.rest.response.RatingResponse;
import org.springframework.stereotype.Service;

@Service
public class RatingToRatingResponseConverter implements Converter<Rating, RatingResponse> {

    @Override
    public RatingResponse convert(Rating source) {
        RatingResponse target = new RatingResponse();
        target.setRating(source.getRate());
        return target;
    }

    @Override
    public Class<Rating> getSource() {
        return Rating.class;
    }

    @Override
    public Class<RatingResponse> getTarget() {
        return RatingResponse.class;
    }
}
