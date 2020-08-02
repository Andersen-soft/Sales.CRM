package com.andersenlab.crm.services.helpers;

import com.andersenlab.crm.model.entities.Resume;
import com.andersenlab.crm.rest.request.UpdateResumeRequest;
import com.andersenlab.crm.services.EmployeeService;
import com.andersenlab.crm.utils.ServiceUtils;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@AllArgsConstructor
public class ResumeHelper {

    private final EmployeeService employeeService;

    public Resume updateResumeFields(Resume resume, UpdateResumeRequest request) {
        Optional.ofNullable(request.getStatus())
                .ifPresent(status -> resume.setStatus(ServiceUtils.getByNameOrThrow(Resume.Status.class, status)));
        Optional.ofNullable(request.getIsActive())
                .ifPresent(resume::setIsActive);
        Optional.ofNullable(request.getResponsibleId())
                .ifPresent(resp -> resume.setResponsibleHr(employeeService.getEmployeeByIdOrThrowException(resp)));
        return resume;
    }
}

