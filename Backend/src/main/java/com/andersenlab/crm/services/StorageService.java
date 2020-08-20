package com.andersenlab.crm.services;

import com.andersenlab.crm.exceptions.CrmFileUploadException;
import com.andersenlab.crm.model.DownloadedFile;
import com.andersenlab.crm.model.StoredFile;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface StorageService {

    List<StoredFile> uploadFiles(String prefixId, MultipartFile... files);

    void deleteFile(String fileName);

    default DownloadedFile getFile(String fileName) {
        throw new CrmFileUploadException("Method not supported");
    }
}
