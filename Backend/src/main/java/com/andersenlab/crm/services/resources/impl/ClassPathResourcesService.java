package com.andersenlab.crm.services.resources.impl;

import com.andersenlab.crm.services.resources.ResourcesService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClassPathResourcesService implements ResourcesService {
    private final ResourceLoader resourceLoader;

    private static final String PROTOCOL_PREFIX = "classpath:";
    private static final String QUERY_TEMPLATE_BASE_PATH = "report-sql/";
    private static final String EMPTY = "";

    @Override
    public String loadTemplate(@NonNull String path) {
        return loadAsString(QUERY_TEMPLATE_BASE_PATH + path);
    }

    @Override
    public String loadAsString(@NonNull String path) {
        try(InputStream inputStream = loadAsStream(path)) {
            final byte[] bytes = IOUtils.toByteArray(inputStream);
            final String template = new String(bytes, StandardCharsets.UTF_8);
            return StringUtils.normalizeSpace(template);
        } catch (IOException e) {
            log.error("Stream loading error: ", e);
            return EMPTY;
        }
    }
    private InputStream loadAsStream(@NonNull String path) throws IOException {
        return resourceLoader.getResource(fullPath(path)).getInputStream();
    }

    private String fullPath(String path) {
        return PROTOCOL_PREFIX + path;
    }
}
