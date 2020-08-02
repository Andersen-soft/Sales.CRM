package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.entities.Resume;
import com.andersenlab.crm.rest.dto.file.FileDto;
import com.andersenlab.crm.rest.response.ResumeResponse;
import com.andersenlab.crm.rest.sample.EmployeeSample;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.andersenlab.crm.utils.ConverterHelper.getNullable;
import static java.util.Optional.ofNullable;

@Service
@AllArgsConstructor
public class ResumeToDtoConverter implements Converter<Resume, ResumeResponse> {

    private final ConversionService conversionService;

    @Override
    public Class<Resume> getSource() {
        return Resume.class;
    }

    @Override
    public Class<ResumeResponse> getTarget() {
        return ResumeResponse.class;
    }

    @Override
    public ResumeResponse convert(Resume source) {
        ResumeResponse target = new ResumeResponse();
        target.setId(source.getId());
        target.setIsActive(source.getIsActive());
        target.setFio(source.getFio());
        target.setFio(source.getFio());
        ofNullable(source.getResumeRequest())
                .ifPresent(resumeRequest -> target.setRequestId(resumeRequest.getId()));
        ofNullable(source.getResumeRequest())
                .ifPresent(resumeRequest -> target.setRequestName(resumeRequest.getName()));
        ofNullable(source.getResumeRequest())
                .ifPresent(resumeRequest -> target.setDeadline(resumeRequest.getDeadline()));
        target.setResponsibleEmployee(convertEmployee(source));
        target.setStatus(getNullable(source.getStatus(), Resume.Status::getName));
        ofNullable(source.getStatus())
                .map(Resume.Status::getName).ifPresent(target::setStatus);
        target.setFiles(convertFiles(source));
        ofNullable(source.getHrComment()).ifPresent(target::setHrComment);
        target.setIsUrgent(source.getIsUrgent());

        target.setDateCreated(source.getCreateDate());
        return target;
    }

    private EmployeeSample convertEmployee(Resume source) {
        return conversionService.convert(source.getResponsibleHr(), EmployeeSample.class);
    }

    private List<FileDto> convertFiles(Resume source){
        ofNullable(source.getFiles())
                .ifPresent(files -> files.sort((o1, o2) -> o2.getCreationDate().compareTo(o1.getCreationDate())));
        return conversionService.convertToList(source.getFiles(), FileDto.class);
    }

}
