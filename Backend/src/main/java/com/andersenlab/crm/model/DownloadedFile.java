package com.andersenlab.crm.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class DownloadedFile {
    private String fileName;
    private ByteArrayResource resource;
    private MediaType mediaType;
    private long length;
}
