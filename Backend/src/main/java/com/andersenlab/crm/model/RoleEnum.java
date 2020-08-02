package com.andersenlab.crm.model;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum RoleEnum implements Nameable { // ordinal number is critical !
    ROLE_ADMIN("Admin"), // old DB : admin
    ROLE_SITE("Site"), // Access for API from Site Andersen
    ROLE_SALES_HEAD("Sales Head"),
    ROLE_RM("RM"),// old DB :superProjectManager
    ROLE_SALES("Sales"), // old DB : salesManager
    ROLE_HR("HR"),
    ROLE_MANAGER("Manager"), // old DB : projectManager
    ROLE_NETWORK_COORDINATOR("Network Coordinator"),
    ROLE_SALES_ASSISTANT("Sales Assistant");

    private String name;
}
