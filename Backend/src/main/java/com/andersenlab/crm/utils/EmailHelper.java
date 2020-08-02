package com.andersenlab.crm.utils;

import com.andersenlab.crm.model.RecipientDto;
import com.andersenlab.crm.model.entities.Employee;

import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

public class EmailHelper {
    public static final String URL = "url";
    public static final String APP_URL = "appUrl";

    private EmailHelper() {
    }

    public static RecipientDto mapEmployeeToRecipientDto(Employee source) {
        return RecipientDto
                .builder()
                .fio(source.getFirstName() + " " + source.getLastName())
                .contact(source.getEmail())
                .build();
    }

    public static Set<RecipientDto> prepareRecipients(List<Employee> recipients, Employee currentUser) {
        return recipients.stream()
                .filter(Objects::nonNull)
                .filter(Employee::getIsActive)
                .filter(recipient -> recipient.getEmail() != null)
                .filter(recipient -> !recipient.getEmail().equals(currentUser.getEmail()))
                .map(EmailHelper::mapEmployeeToRecipientDto)
                .collect(Collectors.toSet());
    }
}
