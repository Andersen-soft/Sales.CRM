package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.rest.request.EmployeeCreateRequest;
import com.andersenlab.crm.services.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Optional;

/**
 * Provides type conversion EmployeeCreateRequest-to-Employee.
 */
@RequiredArgsConstructor
@Component
public class EmployeeCreateRequestToEmployeeConverter implements Converter<EmployeeCreateRequest, Employee> {
    private final EmployeeService employeeService;

    @Override
    public Employee convert(EmployeeCreateRequest source) {
        Employee target = new Employee();
        target.setEmail(source.getEmail());
        if (source.getAdditionalEmails() != null) {
            target.setAdditionalEmails(new HashSet<>(source.getAdditionalEmails()));
        }
        target.setLogin(source.getLogin());
        target.setFirstName(source.getFirstName());
        target.setLastName(source.getLastName());
        target.setSkype(source.getSkype());
        target.setEmployeeLang(source.getEmployeeLang());
        target.setPosition(source.getPosition());
        target.setAdditionalInfo(source.getAdditionalInfo());
        target.setDayDistributionParticipant(Optional.ofNullable(source.getLotteryParticipantDay()).orElse(false));
        target.setNightDistributionParticipant(Optional.ofNullable(source.getLotteryParticipantNight()).orElse(false));
        target.setRegionalDistributionParticipant(Optional.ofNullable(source.getLotteryParticipantRegional()).orElse(false));
        target.setResponsibleRM(source.getResponsibleRM());
        target.setTelegramUsername(source.getTelegramUsername());
        Optional.ofNullable(source.getMentorId()).ifPresent(mentorId ->
                target.setMentor(defineEmployee(mentorId)));
        return target;
    }

    @Override
    public Class<EmployeeCreateRequest> getSource() {
        return EmployeeCreateRequest.class;
    }

    @Override
    public Class<Employee> getTarget() {
        return Employee.class;
    }

    private Employee defineEmployee(final Long id) {
        return employeeService.getEmployeeByIdOrThrowException(id);
    }
}
