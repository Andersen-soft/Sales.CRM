package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.model.entities.File;
import com.andersenlab.crm.model.entities.Resume;
import com.andersenlab.crm.model.entities.SaleRequest;
import com.andersenlab.crm.rest.response.FileResponse;
import org.junit.Before;
import org.junit.Test;

import java.time.LocalDateTime;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.mock;

/**
 * @author Yevhenii Muzyka on 08.08.2018
 */
public class FileToFileResponseConverterTest {

    private FileToFileResponseConverter converter;

    @Before
    public void setUp() {
        ConversionService service = mock(ConversionService.class);
        converter = new FileToFileResponseConverter(service);
    }

    @Test
    public void whenConvertThenFieldsOfConvertedExpected() {
        File file = new File();
        Resume resume = new Resume();
        resume.setId(1L);
        SaleRequest saleRequest = new SaleRequest();
        saleRequest.setId(1L);

        file.setId(2L);
        file.setName("Name");
        file.setCreationDate(LocalDateTime.now());
        file.setSaleObject(resume);
        file.setSaleRequest(saleRequest);

        FileResponse response = converter.convert(file);
        assertEquals(file.getId(), response.getId());
        assertEquals(file.getName(), response.getName());
        assertEquals(file.getCreationDate(), response.getCreationDate());
        assertEquals(file.getSaleObject().getId(), response.getSaleObjectId());
        assertEquals(file.getSaleRequest().getId(), response.getSaleRequestId());
    }

    @Test
    public void whenGetClassesThenReturnExpected() {
        assertEquals(converter.getSource(), File.class);
        assertEquals(converter.getTarget(), FileResponse.class);
    }
}
