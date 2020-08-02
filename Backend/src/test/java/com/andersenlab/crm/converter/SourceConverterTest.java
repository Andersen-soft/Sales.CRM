package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.SimpleConverter;
import com.andersenlab.crm.model.entities.Source;
import com.andersenlab.crm.rest.response.SourceDto;
import lombok.extern.slf4j.Slf4j;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertNotNull;

@Slf4j
public class SourceConverterTest {

    private SimpleConverter<SourceDto, Source> converter;
    private SourceDto sourceDto;
    private Source source;

    @Before
    public void setUp() {
        converter = new SourceConverter();

        sourceDto = new SourceDto(1L);
        sourceDto.setName("Source name");
        sourceDto.setType("Другое");

        source = new Source(1L);
        source.setName("Source name");
        source.setType(Source.Type.OTHER);

    }

    @Test
    public void convertFromDto() {
        Source entity = converter.convertFromDto(sourceDto);
        log.info(entity.toString());
        assertNotNull(entity);
    }

    @Test
    public void convertFromEntity() {
        SourceDto dto = converter.convertFromEntity(source);
        log.info(dto.toString());
        assertNotNull(dto);

    }

    @Test
    public void convertFromEntityNull() {
        SourceDto dto = converter.convertFromEntity(new Source());
        assertNotNull(dto);
    }

    @Test
    public void convertFromDtoNull() {
        Source entity = converter.convertFromDto(new SourceDto());
        assertNotNull(entity);
    }

}
