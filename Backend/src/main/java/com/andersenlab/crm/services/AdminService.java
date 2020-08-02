package com.andersenlab.crm.services;

import com.andersenlab.crm.model.LdapUser;
import com.andersenlab.crm.rest.dto.ChangePassDto;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.rest.request.EmployeeCreateRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminService {

    Employee registerInCrm(EmployeeCreateRequest employeeCreateRequest);

    Page<LdapUser> getPageableLdapUsers(String name, String email, Boolean isRegistered, Pageable pageable);

    String resetPassword(Long id);

    ChangePassDto checkToken(String token);

    void changePassword(ChangePassDto passDto);
}
