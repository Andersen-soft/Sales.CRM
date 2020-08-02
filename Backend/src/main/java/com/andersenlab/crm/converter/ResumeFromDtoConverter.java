package com.andersenlab.crm.converter;


import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.model.entities.Resume;
import com.andersenlab.crm.rest.request.ResumeDto;
import com.andersenlab.crm.utils.ServiceUtils;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class ResumeFromDtoConverter implements Converter<ResumeDto, Resume> {

    @Override
    public Resume convert(ResumeDto source) {
        Resume resume = new Resume();
        resume.setFio(source.getFio());
        Optional.ofNullable(source.getStatus())
                .ifPresent(status -> resume.setStatus(ServiceUtils.getByNameOrThrow(Resume.Status.class, status)));
        Optional.ofNullable(source.getResponsibleHrId())
                .ifPresent(id -> resume.setResponsibleHr(new Employee(id)));
        Optional.ofNullable(source.getHrComment()).ifPresent(resume::setHrComment);
        resume.setIsUrgent(source.getIsUrgent());
        return resume;
    }

    @Override
    public Class<ResumeDto> getSource() {
        return ResumeDto.class;
    }

    @Override
    public Class<Resume> getTarget() {
        return Resume.class;
    }
}
