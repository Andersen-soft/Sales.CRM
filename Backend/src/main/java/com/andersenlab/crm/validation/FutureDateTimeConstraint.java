package com.andersenlab.crm.validation;

import lombok.extern.slf4j.Slf4j;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Slf4j
public class FutureDateTimeConstraint implements ConstraintValidator<FutureDateTime, LocalDateTime> {

    public boolean isValid(LocalDateTime dateTime, ConstraintValidatorContext context) {
        if (dateTime != null) {
            LocalTime localTime = dateTime.toLocalTime();
            return "00:00".equals(localTime.toString()) ?
                    !dateTime.toLocalDate().isBefore(LocalDateTime.now().toLocalDate()) :
                    !dateTime.isBefore(LocalDateTime.now());
        }
        return true;
    }
}
