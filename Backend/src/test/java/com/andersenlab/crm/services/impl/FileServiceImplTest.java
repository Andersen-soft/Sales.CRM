package com.andersenlab.crm.services.impl;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.exceptions.ResourceNotFoundException;
import com.andersenlab.crm.model.entities.File;
import com.andersenlab.crm.repositories.FileRepository;
import com.andersenlab.crm.repositories.SaleObjectRepository;
import com.andersenlab.crm.repositories.SaleRequestRepository;
import com.andersenlab.crm.rest.request.FileUpdateRequest;
import com.andersenlab.crm.rest.response.FileResponse;
import org.junit.Test;
import org.springframework.data.domain.Example;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertSame;
import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.anyLong;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

/**
 * @author Yevhenii Muzyka on 08.08.2018
 */
public class FileServiceImplTest {
    private static final String TEST_STRING = "TEST";
    private FileRepository fileRepository = mock(FileRepository.class);
    private ConversionService conversionService = mock(ConversionService.class);

    private FileServiceImpl fileService = new FileServiceImpl(
            fileRepository,
            conversionService,
            mock(SaleObjectRepository.class),
            mock(SaleRequestRepository.class)
    );

    @Test
    public void whenCreateFileThenRepositorySaveAndFlush() {
        FileUpdateRequest request = new FileUpdateRequest();
        request.setName(TEST_STRING);

        File file1 = new File();

        File file = new File();
        file.setName(TEST_STRING);
        Example<File> fileExample = Example.of(file);

        given(conversionService.convert(request, File.class)).willReturn(file1);
        given(fileRepository.exists(fileExample)).willReturn(false);

        fileService.createFile(request);

        verify(fileRepository, times(1)).saveAndFlush(file1);
    }

    @Test
    public void whenUpdateFileThenStringFieldsUpdated() {
        FileUpdateRequest request = new FileUpdateRequest();
        request.setName(TEST_STRING);

        File file = new File();
        file.setName("Name");

        given(fileRepository.findOne(anyLong())).willReturn(file);
        fileService.updateFile(0L, request);
        assertEquals(TEST_STRING, file.getName());
    }

    @Test(expected = ResourceNotFoundException.class)
    public void whenUpdateFileAndFileNotFoundThenExpectedException() {
        given(fileRepository.findOne(anyLong())).willReturn(null);
        fileService.updateFile(0L, new FileUpdateRequest());
    }

    @Test
    public void whenGetFileByIdThenReturnExpectedresponse() {
        File file = new File();
        file.setName(TEST_STRING);

        given(fileRepository.findOne(anyLong())).willReturn(file);

        File result = fileService.getById(0L);
        assertSame(file, result);
    }

    @Test
    public void whenGetAllFilesThenExpectedListOfresponses() {
        List<File> foundFiles = new ArrayList<>();
        List<FileResponse> foundFileResponses = new ArrayList<>();

        given(fileRepository.findAll()).willReturn(foundFiles);
        given(conversionService.convertToList(foundFiles, FileResponse.class)).willReturn(foundFileResponses);

        List<FileResponse> response = fileService.getAllFiles();
        assertSame(foundFileResponses, response);
    }
}
