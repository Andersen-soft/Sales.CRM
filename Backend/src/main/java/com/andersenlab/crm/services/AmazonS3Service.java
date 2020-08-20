package com.andersenlab.crm.services;

import com.amazonaws.SdkClientException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectSummary;
import com.amazonaws.util.IOUtils;
import com.andersenlab.crm.configuration.properties.S3Properties;
import com.andersenlab.crm.exceptions.CrmFileUploadException;
import com.andersenlab.crm.model.DownloadedFile;
import com.andersenlab.crm.model.StoredFile;
import com.andersenlab.crm.utils.CrmFileUtils;
import com.andersenlab.crm.utils.StreamUtils;
import lombok.Data;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.apache.tika.Tika;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Amazon S3 storage client
 *
 * @author v.pronkin on 30.07.2018
 */
@ConditionalOnProperty(
        value = "storage.type",
        havingValue = "amazonS3"
)
@Service
@Slf4j
@Data
public class AmazonS3Service implements StorageService {

    private final AmazonS3 s3client;
    private final S3Properties properties;


    public List<StoredFile> uploadFiles(String prefixId, MultipartFile... files) {
        try {
            List<MultipartFile> fileList = StreamUtils.streamOf(files)
                    .collect(Collectors.toList());
            if (fileList.isEmpty()) {
                return Collections.emptyList();
            }
            return uploadFileList(prefixId, fileList);
        } catch (SdkClientException sdkException) {
            log.error("Unable to upload file", sdkException);
            throw new CrmFileUploadException("Unable to upload file");
        }
    }

    public void deleteFile(String fileName) {
        s3client.deleteObject(new DeleteObjectRequest(properties.getBucketName(), fileName));
    }

    private List<StoredFile> uploadFileList(String prefixId, List<MultipartFile> files) {
        log.info("Trying upload files {}", files);
        try {
            List<StoredFile> results = uploadFilesToS3Bucket(prefixId, files);
            log.info("Successful upload {}", files);
            return results;
        } catch (SdkClientException e) {
            log.error("Error", e);
            throw new CrmFileUploadException("Unable to upload files");
        } catch (IOException e) {
            log.error("Can't get input stream", e);
            throw new CrmFileUploadException("Unable to upload files");
        }
    }

    private List<StoredFile> uploadFilesToS3Bucket(String prefixId, List<MultipartFile> files) throws IOException {
        List<StoredFile> results = new ArrayList<>();
        for (MultipartFile multipartFile : files) {
            results.add(put(prefixId, multipartFile));
        }
        return results;
    }

    private StoredFile put(String prefixId, MultipartFile multipartFile) throws IOException {
        String uuid = UUID.randomUUID().toString();
        String filename = multipartFile.getOriginalFilename();
        String key = properties.getPrefix() + "/" + prefixId + "/" + uuid + CrmFileUtils.getExtension(filename);
        ObjectMetadata objectMetadata = defineObjectMetaData(multipartFile);
        PutObjectRequest putObjectRequest = new PutObjectRequest(properties.getBucketName(), key, multipartFile.getInputStream(), objectMetadata);
        s3client.putObject(putObjectRequest);
        return new StoredFile(key, filename);
    }

    private ObjectMetadata defineObjectMetaData(MultipartFile multipartFile) throws IOException {
        ObjectMetadata objectMetadata = new ObjectMetadata();
        Tika tika = new Tika();
        String mimeType = tika.detect(multipartFile.getInputStream(), multipartFile.getOriginalFilename());
        objectMetadata.setContentType(mimeType);
        objectMetadata.setContentLength(multipartFile.getSize());
        return objectMetadata;
    }

    public List<String> getAmazonFileNames() {
        return s3client.listObjectsV2(properties.getBucketName()).getObjectSummaries().stream()
                .map(S3ObjectSummary::getKey)
                .collect(Collectors.toList());
    }

    @SneakyThrows
    @Override
    public DownloadedFile getFile(String key) {
        DownloadedFile file = new DownloadedFile();
        S3Object object = s3client.getObject(new GetObjectRequest(properties.getBucketName(), key));
        byte[] data = IOUtils.toByteArray(object.getObjectContent());
        file.setResource(new ByteArrayResource(data));
        file.setLength(data.length);
        file.setMediaType(MediaType.parseMediaType(object.getObjectMetadata().getContentType()));
        return file;
    }
}
