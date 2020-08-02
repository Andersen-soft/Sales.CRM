package com.andersenlab.crm.converter;

import com.andersenlab.crm.model.entities.Resume;
import com.andersenlab.crm.rest.sample.ResumeSample;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class ResumeToResumeSampleConverterTest {

    private ResumeToResumeSampleConverter converter = new ResumeToResumeSampleConverter();

    @Test
    public void testConvert() {
        Resume source = new Resume();
        source.setId(2L);
        source.setFio("Test Fio");
        source.setIsActive(true);
        source.setStatus(Resume.Status.DONE);

        ResumeSample result = converter.convert(source);

        assertEquals(source.getFio(), result.getFio());
        assertEquals(source.getId(), result.getId());
        assertEquals(true, result.getIsActive());
        assertEquals(source.getStatus().getName(), result.getStatus());
    }

    @Test
    public void testGetSource() {
        Class<Resume> expectedResult = Resume.class;

        Class<Resume> result = converter.getSource();

        assertEquals(expectedResult, result);
    }

    @Test
    public void testGetTarget() {
        Class<ResumeSample> expectedResult = ResumeSample.class;

        Class<ResumeSample> result = converter.getTarget();

        assertEquals(expectedResult, result);
    }
}