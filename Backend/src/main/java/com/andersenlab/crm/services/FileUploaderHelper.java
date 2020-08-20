package com.andersenlab.crm.services;

import com.andersenlab.crm.exceptions.CrmException;
import com.andersenlab.crm.model.DownloadedFile;
import com.andersenlab.crm.model.StoredFile;
import com.andersenlab.crm.model.entities.File;
import com.andersenlab.crm.repositories.FileRepository;
import com.andersenlab.crm.security.AuthenticatedUser;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@AllArgsConstructor
public class FileUploaderHelper {

    private final AuthenticatedUser authenticatedUser;
    private final StorageService storageService;
    private final FileRepository fileRepository;

    public List<File> uploadFilesAndGetEntities(String prefixId, MultipartFile... files) {
        MultipartFile[] filtered = filterEmpty(files);
        List<StoredFile> filesWithLinks = storageService.uploadFiles(prefixId, filtered);
        return createEntityFilesFromUploadsResult(filesWithLinks);
    }

    private MultipartFile[] filterEmpty(MultipartFile[] files) {
        return Arrays.stream(files)
                .filter(file -> file.getSize() > 0)
                .toArray(MultipartFile[]::new);
    }

    public void deleteFileById(Long idFile) {
        File file = findOrThrowException(idFile);
        String amzKey = file.getKey();
        deleteFileFromAmz(amzKey);
        fileRepository.delete(file.getId());
    }

    public void deleteFileFromAmazonById(Long idFile) {
        File file = findOrThrowException(idFile);
        String amzKey = file.getKey();
        deleteFileFromAmz(amzKey);
    }

    private File findOrThrowException(Long id) {
        return Optional.ofNullable(fileRepository.getOne(id))
                .orElseThrow(() -> new CrmException("no file with such id: " + id));
    }

    public File uploadFileAndGetEntity(String prefixId, MultipartFile file) {
        return uploadFilesAndGetEntities(prefixId, file).stream()
                .findFirst()
                .orElseThrow(() -> new CrmException("Something wrong with uploading file"));
    }

    private void deleteFileFromAmz(String amzKey) {
        storageService.deleteFile(amzKey);
    }

    private List<File> createEntityFilesFromUploadsResult(List<StoredFile> storedFiles) {
        return storedFiles.stream()
                .map(uploadResult -> {
                    File file = new File();
                    file.setUploadedBy(authenticatedUser.getCurrentEmployee());
                    file.setCreationDate(LocalDateTime.now());
                    file.setName(uploadResult.getName());
                    file.setKey(uploadResult.getKey());
                    return file;
                }).collect(Collectors.toList());
    }

    public void delete(String amazonKey) {
        storageService.deleteFile(amazonKey);
    }

    public DownloadedFile getFile(Long id) {
        File file = findOrThrowException(id);
        DownloadedFile downloadedFile = storageService.getFile(file.getKey());
        downloadedFile.setFileName(file.getName());
        return downloadedFile;
    }
}