package com.andersenlab.crm.services.impl;

import com.andersenlab.crm.exceptions.CrmException;
import com.andersenlab.crm.model.entities.QRole;
import com.andersenlab.crm.model.entities.Role;
import com.andersenlab.crm.repositories.RoleRepository;
import com.andersenlab.crm.services.RoleService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static com.andersenlab.crm.exceptions.ExceptionMessages.WRONG_ROLES_MESSAGE;

@Service
@AllArgsConstructor
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;

    @Override
    @Transactional
    public Iterable<Role> getRoles() {
        return roleRepository.findAll();
    }

    @Override
    @Transactional
    public Set<Role> getRolesOrThrowException(Long[] roleIds) {
        Iterable<Role> rolesIterable = roleRepository.findAll(QRole.role.id.in(Arrays.asList(roleIds)));
        Set<Role> roles = StreamSupport.stream(rolesIterable.spliterator(), false).collect(Collectors.toSet());
        if (roles.isEmpty()) {
            throw new CrmException(WRONG_ROLES_MESSAGE);
        }
        return roles;
    }
}
