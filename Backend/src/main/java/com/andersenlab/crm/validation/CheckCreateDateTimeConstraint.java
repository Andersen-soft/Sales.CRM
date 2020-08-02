package com.andersenlab.crm.validation;

import lombok.extern.slf4j.Slf4j;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.time.LocalDateTime;

@Slf4j
public class CheckCreateDateTimeConstraint implements ConstraintValidator<CheckCreateDateTime, LocalDateTime> {

    public boolean isValid(LocalDateTime dateTime, ConstraintValidatorContext context) {
        //обнуляем секунды, чтоб исключить рассинхрон между терминалом и сервером
        if (dateTime != null) {
            return "00:00".equals(dateTime.toLocalTime().toString()) ?
                    dateTime.toLocalDate().isBefore(LocalDateTime.now().toLocalDate()) :
                    dateTime.withSecond(0).withNano(0).isBefore(LocalDateTime.now());
        }
        return true;
    }
}
