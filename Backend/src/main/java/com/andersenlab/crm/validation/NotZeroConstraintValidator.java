package com.andersenlab.crm.validation;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class NotZeroConstraintValidator implements ConstraintValidator<NotZero, Long> {
    @Override
    public boolean isValid(Long value, ConstraintValidatorContext context) {
	    return value == null || value != 0;
    }
}
