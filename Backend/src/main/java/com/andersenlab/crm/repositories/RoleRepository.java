package com.andersenlab.crm.repositories;

import com.andersenlab.crm.model.RoleEnum;
import com.andersenlab.crm.model.entities.QRole;
import com.andersenlab.crm.model.entities.Role;

public interface RoleRepository extends BaseRepository<QRole, Role, Long>{
    Role findRoleByName(RoleEnum role);
}
