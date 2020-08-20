package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.entities.File;
import com.andersenlab.crm.rest.request.FileUpdateRequest;
import org.springframework.stereotype.Component;

/**
 * Provides type conversion FileCreateRequest to File.
 *
 * @author Yevhenii Muzyka on 07.08.2018
 */
@Component
public class FileUpdateRequestToFileConverter implements Converter<FileUpdateRequest, File> {

    @Override
    public File convert(FileUpdateRequest source) {
        File target = new File();
        target.setName(source.getName());
        target.setCreationDate(source.getCreationDate());
        return target;
    }

    @Override
    public Class<FileUpdateRequest> getSource() {
        return FileUpdateRequest.class;
    }

    @Override
    public Class<File> getTarget() {
        return File.class;
    }
}
