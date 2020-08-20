package com.andersenlab.crm.services;

import com.andersenlab.crm.model.entities.File;
import com.andersenlab.crm.rest.request.FileUpdateRequest;
import com.andersenlab.crm.rest.response.FileResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * @author Yevhenii Muzyka on 07.08.2018
 */
public interface FileService {

    void createFile(FileUpdateRequest request);

    void updateFile(Long id, FileUpdateRequest request);

    void deleteFile(Long id);

    List<FileResponse> getAllFiles();

    File getById(Long id);

    void delete(File file);

    File save(File file);

    Page<File> getFileBySaleRequestId(Pageable pageable, Long saleRequestId);
}
