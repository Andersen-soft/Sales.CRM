package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.entities.Role;
import com.andersenlab.crm.rest.response.RoleResponse;
import org.springframework.stereotype.Component;

@Component
public class RoleToRoleResponseConverter implements Converter<Role, RoleResponse> {
    @Override
    public RoleResponse convert(Role source) {
        RoleResponse target = new RoleResponse();
        target.setId(source.getId());
        target.setName(source.getName().getName());
        return target;
    }

    @Override
    public Class<Role> getSource() {
        return Role.class;
    }

    @Override
    public Class<RoleResponse> getTarget() {
        return RoleResponse.class;
    }
}
