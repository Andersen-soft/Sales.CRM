package com.andersenlab.crm.services.impl;

import com.andersenlab.crm.configuration.properties.LocalStorageProperties;
import com.andersenlab.crm.model.DownloadedFile;
import com.andersenlab.crm.model.StoredFile;
import com.andersenlab.crm.services.StorageService;
import com.andersenlab.crm.utils.CrmFileUtils;
import com.andersenlab.crm.utils.StreamUtils;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.apache.tika.Tika;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@ConditionalOnProperty(
        value = "storage.type",
        havingValue = "local"
)
@Service
public class LocalStorageService implements StorageService {

    private final LocalStorageProperties localStorageProperties;

    @Override
    public List<StoredFile> uploadFiles(String prefixId, MultipartFile... files) {
        List<MultipartFile> fileList = StreamUtils.streamOf(files)
                .collect(Collectors.toList());
        if (fileList.isEmpty()) {
            return Collections.emptyList();
        }
        return uploadFileList(prefixId, fileList);
    }
    

    @Override
    @SneakyThrows
    public void deleteFile(String fileName) {
        Path path = Paths.get(localStorageProperties.getDirectory()
                + File.separator + CrmFileUtils.replaceAllFileSeparator(fileName));
        Files.deleteIfExists(path);
    }

    @Override
    @SneakyThrows
    public DownloadedFile getFile(String fileName) {
        DownloadedFile file = new DownloadedFile();
        Path path = Paths.get(localStorageProperties.getDirectory()
                + File.separator + CrmFileUtils.replaceAllFileSeparator(fileName));
        byte[] data = Files.readAllBytes(path);
        file.setResource(new ByteArrayResource(data));
        file.setLength(data.length);
        Tika tika = new Tika();
        String mimeType = tika.detect(data);
        file.setMediaType(MediaType.parseMediaType(mimeType));
        return file;
    }

    private List<StoredFile> uploadFileList(String prefixId, List<MultipartFile> files) {
        List<StoredFile> results = new ArrayList<>();
        for (MultipartFile multipartFile : files) {
            results.add(put(prefixId, multipartFile));
        }
        return results;
    }

    @SneakyThrows
    private StoredFile put(String prefixId, MultipartFile multipartFile) {
        String uuid = UUID.randomUUID().toString();
        String fileName = multipartFile.getOriginalFilename();
        String key = prefixId + "/" + uuid + CrmFileUtils.getExtension(fileName);
        Path path = Paths.get(localStorageProperties.getDirectory()
                + File.separator+ CrmFileUtils.replaceAllFileSeparator(key));
        Files.createDirectories(path.getParent());
        Files.write(path, multipartFile.getBytes());
        return new StoredFile(key, fileName);

    }
}
