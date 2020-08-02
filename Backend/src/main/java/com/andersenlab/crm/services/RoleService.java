package com.andersenlab.crm.services;

import com.andersenlab.crm.model.entities.Role;

import java.util.Set;

public interface RoleService {

    Iterable<Role> getRoles();

    Set<Role> getRolesOrThrowException(Long[] roleIds);




}
