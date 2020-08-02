package com.andersenlab.crm.converter;

import com.andersenlab.crm.model.entities.Rating;
import com.andersenlab.crm.rest.response.RatingResponse;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class RatingToRatingResponseConverterTest {

    private RatingToRatingResponseConverter converter = new RatingToRatingResponseConverter();

    @Test
    public void testConvert() {
        Rating source = new Rating();
        source.setRate(5);

        RatingResponse result = converter.convert(source);

        assertEquals(source.getRate(), result.getRating());
    }

    @Test
    public void testGetSource() {
        Class<Rating> expectedResult = Rating.class;

        Class<Rating> result = converter.getSource();

        assertEquals(expectedResult, result);
    }

    @Test
    public void testGetTarget() {
        Class<RatingResponse> expectedResult = RatingResponse.class;

        Class<RatingResponse> result = converter.getTarget();

        assertEquals(expectedResult, result);
    }
}