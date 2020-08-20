package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.SimpleConverter;
import com.andersenlab.crm.model.entities.Source;
import com.andersenlab.crm.rest.response.SourceDto;
import com.andersenlab.crm.utils.ServiceUtils;

import java.util.Optional;

public class SourceConverter extends SimpleConverter<SourceDto, Source> {

    public SourceConverter() {
        super(SourceConverter::fromDto, SourceConverter::toDto);
    }

    private static Source fromDto(SourceDto dto) {
        Source resource = new Source();
        Optional.ofNullable(dto.getId()).ifPresent(resource::setId);
        Optional.ofNullable(dto.getName()).ifPresent(resource::setName);
        Optional.ofNullable(dto.getType()).ifPresent(o -> resource.setType(defineType(o)));
        return resource;
    }

    private static SourceDto toDto(Source resource) {
        final SourceDto dto = new SourceDto();
        Optional.ofNullable(resource.getId()).ifPresent(dto::setId);
        Optional.ofNullable(resource.getName()).ifPresent(dto::setName);
        Optional.ofNullable(resource.getType()).ifPresent(o -> dto.setType(o.getName()));
        return dto;
    }

    private static Source.Type defineType(String name) {
        return ServiceUtils.getByNameOrThrow(Source.Type.class, name);
    }
}
