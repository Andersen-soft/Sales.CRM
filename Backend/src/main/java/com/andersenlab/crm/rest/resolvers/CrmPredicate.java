package com.andersenlab.crm.rest.resolvers;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Аннотация, с помощью которой помечается предикат в параметрах контроллера
 * {@link com.querydsl.core.types.Predicate}.
 */
@Target({ElementType.PARAMETER, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface CrmPredicate {

    /**
     * Класс, с помощью которого из параметров запроса резолвится предикат {@link PredicateResolver}
     */
    Class<? extends PredicateResolver> resolver();
}
