package com.andersenlab.crm.validation;


import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class NullOrNotEmptyValidator implements ConstraintValidator<NullOrNotEmpty, Object[]> {
    @Override
    public boolean isValid(Object[] value, ConstraintValidatorContext context) {
        return value == null || value.length != 0;
    }
}
