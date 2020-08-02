package com.andersenlab.crm.helpers;

import com.andersenlab.crm.model.entities.Resume;
import com.andersenlab.crm.repositories.ResumeRepository;
import com.andersenlab.crm.rest.request.UpdateResumeRequest;
import com.andersenlab.crm.services.EmployeeService;
import org.junit.Test;

import static com.andersenlab.crm.model.entities.Resume.Status.HR_NEED;
import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.mock;

public class ResumeHelperTest {

    private final EmployeeService employeeService = mock(EmployeeService.class);
    private final ResumeRepository resumeRepository = mock(ResumeRepository.class);

    @Test
    public void whenIfCanDeleteThenOk() {
        Resume resume = new Resume();
        resume.setStatus(HR_NEED);

        assertEquals(java.util.Optional.of(HR_NEED), java.util.Optional.of(resume.getStatus()));
    }

    @Test
    public void whenUpdateResumeStatusFieldThenOk() {
        Resume resume = new Resume();
        resume.setStatus(Resume.Status.IN_PROGRESS);
        UpdateResumeRequest updateResume = new UpdateResumeRequest();
        updateResume.setStatus("IN_PROGRESS");

        assertEquals(resume.getStatus().toString(), updateResume.getStatus());
    }

    @Test
    public void whenUpdateResumeResponsibleHrFieldThenOk() {
        Resume resume = new Resume();
        resume.setResponsibleHr(employeeService.getEmployeeByIdOrThrowException(any(Long.class)));
        UpdateResumeRequest updateResume = new UpdateResumeRequest();
        updateResume.setResponsibleId(1L);

        assertEquals(java.util.Optional.of(1L), java.util.Optional.of(updateResume.getResponsibleId()));
    }
}
