package com.andersenlab.crm.converter;

import com.andersenlab.crm.model.entities.File;
import com.andersenlab.crm.rest.request.FileUpdateRequest;
import org.junit.Test;

import java.time.LocalDateTime;

import static org.junit.Assert.assertEquals;

/**
 * @author Yevhenii Muzyka on 08.08.2018
 */
public class FileUpdateRequestToFileConverterTest {

    private FileUpdateRequestToFileConverter converter = new FileUpdateRequestToFileConverter();

    @Test
    public void whenConvertThenFielsOfConvertedExpected() {
        FileUpdateRequest request = new FileUpdateRequest();

        request.setName("name");
        request.setCreationDate(LocalDateTime.now());

        File convertedFile = converter.convert(request);
        assertEquals(request.getName(), convertedFile.getName());
        assertEquals(request.getCreationDate(), convertedFile.getCreationDate());

    }

    @Test
    public void whenGetClassesThenReturnExpected() {
        assertEquals(converter.getSource(), FileUpdateRequest.class);
        assertEquals(converter.getTarget(), File.class);
    }
}
