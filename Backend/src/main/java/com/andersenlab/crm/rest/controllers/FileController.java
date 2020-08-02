package com.andersenlab.crm.rest.controllers;

import com.andersenlab.crm.aop.HasRole;
import com.andersenlab.crm.model.DownloadedFile;
import com.andersenlab.crm.services.FileUploaderHelper;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.andersenlab.crm.model.RoleEnum.ROLE_HR;
import static com.andersenlab.crm.model.RoleEnum.ROLE_MANAGER;
import static com.andersenlab.crm.model.RoleEnum.ROLE_RM;
import static com.andersenlab.crm.model.RoleEnum.ROLE_SALES;
import static com.andersenlab.crm.model.RoleEnum.ROLE_SALES_HEAD;

@RestController
@RequestMapping("/file")
@RequiredArgsConstructor
public class FileController {

    private final FileUploaderHelper helper;

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_HR, ROLE_MANAGER, ROLE_RM, ROLE_SALES})
    @ApiOperation(value = "Получение файла по id")
    @GetMapping(value = "/download/{id}")
    public ResponseEntity<ByteArrayResource> downloadFile(@PathVariable Long id) {
        DownloadedFile file = helper.getFile(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline;filename=" + file.getFileName())
                .contentType(file.getMediaType())
                .contentLength(file.getLength())
                .body(file.getResource());
    }
}
