package com.andersenlab.crm.services;

import com.andersenlab.crm.model.RoleEnum;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.model.entities.Role;
import com.andersenlab.crm.rest.request.EmployeeUpdateRequest;
import com.andersenlab.crm.rest.response.SaleReportEmployeeResponse;
import com.querydsl.core.types.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Collection;
import java.util.List;

/**
 * Encapsulates business logic and persistence related to employees.
 *
 * @see Employee
 */
public interface EmployeeService {

    /**
     * Saves a given employee
     *
     * @param employee the employee to save
     */
    Employee createEmployee(Employee employee);

    /**
     * Updates the employee with the given id
     *
     * @param id       the login of employee to update
     * @param employee the updated responsible
     */
    Employee updateEmployee(Long id, EmployeeUpdateRequest employee);

    /**
     * Retrieves an responsible by its id.
     *
     * @param id the login of responsible to retrieve
     * @return the responsible with the given id
     */

    Employee getEmployeeByIdOrThrowException(Long id);

    boolean exists(Predicate predicate);

    Employee findByLogin(String login);

    /**
     * Retrieves all employees, filtered
     */
    Page<Employee> getEmployeesWithFilter(Predicate predicate, Pageable pageable);

    List<Employee> getAll();

    List<Employee> getEmployeesByRole(RoleEnum role);

    List<Employee> getEmployeesByRole(List<RoleEnum> roleList);

    List<Employee> getForMailExpressSale();

    void saveEmployee(Employee employee);

    boolean exist(Long id);

    /**
     * Validate employee roles in create/update request when mentor id is not null.
     *
     * @param mentorId      employee id that is a mentor
     */
    void validateMentorSetRequestAndSaleAssistantRole(
            final Long mentorId,
            final Long[] updatedEmployeeRoles,
            final Collection<Role> persistedEmployeeRoles);

    void validateByIdAndRole(Long id, RoleEnum roleEnum);

    Page<SaleReportEmployeeResponse> getReportEmployees(Predicate predicate, Pageable pageable);

    Employee findByEmail(String email);

    boolean existsByEmailIncludingAdditional(String email);
}
