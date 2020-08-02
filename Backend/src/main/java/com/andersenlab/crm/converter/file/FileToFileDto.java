package com.andersenlab.crm.converter.file;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.model.entities.File;
import com.andersenlab.crm.rest.dto.EmployeeDto;
import com.andersenlab.crm.rest.dto.file.FileDto;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@AllArgsConstructor
public class FileToFileDto implements Converter<File, FileDto> {

    private final ConversionService conversionService;

    @Override
    public FileDto convert(File source) {
        FileDto target = new FileDto();
        Optional.ofNullable(source.getId()).ifPresent(target::setId);
        Optional.ofNullable(source.getName()).ifPresent(target::setName);
        Optional.ofNullable(source.getUploadedBy()).ifPresent(s -> target.setEmployee(defineEmployee(s)));
        Optional.ofNullable(source.getCreationDate()).ifPresent(target::setAddedDate);
        return target;
    }

    @Override
    public Class<File> getSource() {
        return File.class;
    }

    @Override
    public Class<FileDto> getTarget() {
        return FileDto.class;
    }

    private EmployeeDto defineEmployee(Employee source) {
        return conversionService.convert(source, EmployeeDto.class);
    }
}
