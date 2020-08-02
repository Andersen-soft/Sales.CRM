package com.andersenlab.crm.services.impl;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.exceptions.ResourceNotFoundException;
import com.andersenlab.crm.model.entities.File;
import com.andersenlab.crm.model.entities.SaleObject;
import com.andersenlab.crm.model.entities.SaleRequest;
import com.andersenlab.crm.repositories.FileRepository;
import com.andersenlab.crm.repositories.SaleObjectRepository;
import com.andersenlab.crm.repositories.SaleRequestRepository;
import com.andersenlab.crm.rest.request.FileUpdateRequest;
import com.andersenlab.crm.rest.response.FileResponse;
import com.andersenlab.crm.services.FileService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import static org.springframework.transaction.annotation.Isolation.SERIALIZABLE;

/**
 * @author Yevhenii Muzyka on 07.08.2018
 */
@Service
@AllArgsConstructor
public class FileServiceImpl implements FileService {

    private final FileRepository fileRepository;
    private final ConversionService conversionService;
    private final SaleObjectRepository saleObjectRepository;
    private final SaleRequestRepository saleRequestRepository;

    @Override
    @Transactional(isolation = SERIALIZABLE)
    public void createFile(FileUpdateRequest request) {
        File file = conversionService.convert(request, File.class);
        Optional.ofNullable(request.getSaleObjectId())
                .map(this::findSaleObjectById)
                .ifPresent(file::setSaleObject);
        Optional.ofNullable(request.getSaleRequestId())
                .map(this::findSaleRequestById)
                .ifPresent(file::setSaleRequest);
        fileRepository.saveAndFlush(file);
    }

    @Override
    public void updateFile(Long id, FileUpdateRequest request) {
        File file = getById(id);
        Optional.ofNullable(request.getName())
                .ifPresent(file::setName);
        Optional.ofNullable(request.getCreationDate())
                .ifPresent(file::setCreationDate);
        Optional.ofNullable(request.getSaleObjectId())
                .map(this::findSaleObjectById)
                .ifPresent(file::setSaleObject);
        Optional.ofNullable(request.getSaleRequestId())
                .map(this::findSaleRequestById)
                .ifPresent(file::setSaleRequest);
        fileRepository.saveAndFlush(file);
    }

    @Override
    public void deleteFile(Long id) {
        fileRepository.delete(id);
    }

    @Override
    public List<FileResponse> getAllFiles() {
        return conversionService.convertToList(fileRepository.findAll(), FileResponse.class);
    }

    @Override
    public File getById(Long id) {
        return Optional.ofNullable(fileRepository.findOne(id))
                .orElseThrow(() -> new ResourceNotFoundException("File not found"));
    }

    @Override
    public void delete(File file) {
        fileRepository.delete(file);
    }

    @Override
    public File save(File file) {
        return fileRepository.save(file);
    }

    @Override
    public Page<File> getFileBySaleRequestId(Pageable pageable, Long saleRequestId) {
        return fileRepository.findAllBySaleRequestId(pageable, saleRequestId);
    }

    private SaleObject findSaleObjectById(Long id) {
        return Optional.ofNullable(saleObjectRepository.findOne(id))
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found"));
    }

    private SaleRequest findSaleRequestById(Long id) {
        return Optional.ofNullable(saleRequestRepository.findOne(id))
                .orElseThrow(() -> new ResourceNotFoundException("Sale not found"));
    }
}
