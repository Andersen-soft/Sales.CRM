package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.entities.Resume;
import com.andersenlab.crm.rest.sample.ResumeSample;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

import static com.andersenlab.crm.utils.ConverterHelper.getNullable;

@Component
@AllArgsConstructor
public class ResumeToResumeSampleConverter implements Converter<Resume, ResumeSample> {

    @Override
    public ResumeSample convert(Resume source) {
        ResumeSample target = new ResumeSample();
        target.setId(source.getId());
        target.setIsActive(source.getIsActive());
        target.setFio(source.getFio());
        target.setStatus(getNullable(source.getStatus(), Resume.Status::getName));
        Optional.ofNullable(source.getResponsibleHr())
                .ifPresent(responsible -> target.setResponsibleHr(responsible.getFirstName()));
        return target;
    }

    @Override
    public Class<Resume> getSource() {
        return Resume.class;
    }

    @Override
    public Class<ResumeSample> getTarget() {
        return ResumeSample.class;
    }
}
