package com.andersenlab.crm.calculation;

import com.andersenlab.crm.model.entities.Resume;
import com.andersenlab.crm.model.entities.ResumeRequest;
import com.andersenlab.crm.rest.sample.SaleRequestSample;
import org.springframework.stereotype.Component;

import java.util.List;

import static com.andersenlab.crm.model.entities.Resume.Status.HR_NEED;
import static com.andersenlab.crm.model.entities.Resume.Status.IN_PROGRESS;

@Component
public class ResumeRequestCalculator {

    public SaleRequestSample.SaleObjects getSaleObjects(ResumeRequest source) {
        List<Resume> resumes = source.getResumes();
        return new SaleRequestSample.SaleObjects(getCount(resumes, IN_PROGRESS), getCount(resumes, HR_NEED));
    }

    private long getCount(List<Resume> resumes, Resume.Status status) {
        return resumes.stream()
                .filter(resume -> resume.getStatus().equals(status))
                .count();
    }
}
