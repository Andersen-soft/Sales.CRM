package com.andersenlab.crm.calculation;

import com.andersenlab.crm.model.entities.Resume;
import com.andersenlab.crm.model.entities.ResumeRequest;
import com.andersenlab.crm.rest.sample.SaleRequestSample.SaleObjects;
import org.junit.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;

public class ResumeRequestCalculatorTest {

    @Test
    public void whenGetSaleObjectsThenReturnCountOfStatuses() {
        SaleObjects saleObject = new SaleObjects(3L, 2L);
        ResumeRequestCalculator requestCalculator = new ResumeRequestCalculator();
        ResumeRequest resumeRequest = new ResumeRequest();
        List<Resume> resumes = new ArrayList<>();
        Resume resume1 = new Resume();
        Resume resume2 = new Resume();
        resume1.setStatus(Resume.Status.HR_NEED);
        resume2.setStatus(Resume.Status.HR_NEED);
        Resume resume3 = new Resume();
        Resume resume4 = new Resume();
        Resume resume5 = new Resume();
        resume3.setStatus(Resume.Status.IN_PROGRESS);
        resume4.setStatus(Resume.Status.IN_PROGRESS);
        resume5.setStatus(Resume.Status.IN_PROGRESS);
        resumes.add(resume1);
        resumes.add(resume2);
        resumes.add(resume3);
        resumes.add(resume4);
        resumes.add(resume5);
        resumeRequest.setResumes(resumes);

        requestCalculator.getSaleObjects(resumeRequest);

        assertEquals(3L, saleObject.getInProgress());
        assertEquals(2L, saleObject.getNewObjects());
        assertEquals(saleObject, requestCalculator.getSaleObjects(resumeRequest));
    }
}
