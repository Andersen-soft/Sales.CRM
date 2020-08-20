package com.andersenlab.crm.aop;

import com.andersenlab.crm.model.RoleEnum;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.FIELD, ElementType.METHOD})
public @interface HasRole {
    RoleEnum[] roles();

    ResponsibleFor[] responsibleFor() default {};
}
