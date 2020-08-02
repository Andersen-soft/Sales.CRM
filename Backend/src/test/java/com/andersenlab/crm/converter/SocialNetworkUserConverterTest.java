package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.SimpleConverter;
import com.andersenlab.crm.model.entities.SocialNetworkUser;
import com.andersenlab.crm.rest.dto.SocialNetworkUserDto;
import org.junit.Before;
import org.junit.Test;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.LongStream;

import static org.junit.Assert.assertEquals;

public class SocialNetworkUserConverterTest {

    private SimpleConverter<SocialNetworkUserDto, SocialNetworkUser> converter;
    private List<SocialNetworkUser> entities;
    private List<SocialNetworkUserDto> dtos;

    @Before
    public void setUp() {
        converter = new SocialNetworkUserConverter();
        entities = LongStream.range(1, 5).mapToObj(this::createEntity).collect(Collectors.toList());
        dtos = LongStream.range(1, 5).mapToObj(this::createDto).collect(Collectors.toList());
    }

    @Test
    public void convertFromDto() {
        SocialNetworkUserDto resource = dtos.get(1);
        SocialNetworkUser result = converter.convertFromDto(resource);
        assertEquals(resource.getId(), result.getId());
        assertEquals(resource.getName(), result.getName());
    }

    @Test
    public void convertFromEntity() {
        SocialNetworkUser resource = entities.get(1);
        SocialNetworkUserDto result = converter.convertFromEntity(resource);
        assertEquals(resource.getId(), result.getId());
        assertEquals(resource.getName(), result.getName());
    }

    @Test
    public void createFromDtos() {
        List<SocialNetworkUser> result = converter.createFromDtos(dtos);
        assertEquals(dtos.size(), result.size());
    }

    @Test
    public void createFromEntities() {
        List<SocialNetworkUserDto> result = converter.createFromEntities(entities);
        assertEquals(dtos.size(), result.size());
    }

    private SocialNetworkUser createEntity(Long id) {
        SocialNetworkUser entity = new SocialNetworkUser(id);
        entity.setName("name_" + id);
        entity.setCreateDate(LocalDateTime.now());
        return entity;
    }

    private SocialNetworkUserDto createDto(Long id) {
        SocialNetworkUserDto dto = new SocialNetworkUserDto(id);
        dto.setName("name_" + id);
        return dto;
    }
}