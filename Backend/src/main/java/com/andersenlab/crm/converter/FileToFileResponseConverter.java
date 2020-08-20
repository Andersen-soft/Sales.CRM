package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.entities.File;
import com.andersenlab.crm.model.entities.SaleObject;
import com.andersenlab.crm.model.entities.SaleRequest;
import com.andersenlab.crm.rest.response.FileResponse;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import static com.andersenlab.crm.utils.ConverterHelper.getNullable;

/**
 * Provides type conversion File to FileResponse.
 *
 * @author Yevhenii Muzyka on 07.08.2018
 */
@Component
@AllArgsConstructor
public class FileToFileResponseConverter implements Converter<File, FileResponse> {

    private final ConversionService conversionService;

    @Override
    public FileResponse convert(File source) {
        FileResponse target = new FileResponse();
        target.setId(source.getId());
        target.setName(source.getName());
        target.setCreationDate(source.getCreationDate());
        target.setSaleObjectId(getNullable(source.getSaleObject(), SaleObject::getId));
        target.setSaleRequestId(getNullable(source.getSaleRequest(), SaleRequest::getId));
        return target;
    }

    @Override
    public Class<File> getSource() {
        return File.class;
    }

    @Override
    public Class<FileResponse> getTarget() {
        return FileResponse.class;
    }
}
