package com.andersenlab.crm.rest.deserializers;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import lombok.extern.log4j.Log4j2;

import java.io.IOException;

import static org.apache.commons.lang3.StringUtils.trimToNull;


/**
 *
 * Removes leading, trailing whitespaces,
 * replaces series of spaces in between with single space
 *
 * trims to {@code null} if the input contains only spaces
 *
 * @see com.fasterxml.jackson.databind.JsonDeserializer
 *
 */
@Log4j2
public class WhiteSpaceRemovalDeserializer extends JsonDeserializer<String> {
    @Override
    public String deserialize(JsonParser jp, DeserializationContext ctxt) {
        try {
            return trimToNull(jp.getValueAsString()
                    .replaceAll(" +", " "));
        } catch (IOException e) {
            log.error(e);
        }
        return null;
    }
}
