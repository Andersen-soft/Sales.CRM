package com.andersenlab.crm.validation;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

/**
 * Validates that date and time in future.
 */
@Target({FIELD})
@Retention(RUNTIME)
@Documented
@Constraint(validatedBy = FutureDateTimeConstraint.class)
public @interface FutureDateTime {
    String message() default "Can not add dates in past";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
