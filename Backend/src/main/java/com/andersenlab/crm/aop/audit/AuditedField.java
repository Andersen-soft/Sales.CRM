package com.andersenlab.crm.aop.audit;

import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Repeatable;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 *
 * History is generated and stored for the 'root' entity being specified by {@code pathToRoot()}
 * in context of changing the data being stored in annotated field
 *
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
@Repeatable(AuditedField.Repeat.class)
@Inherited
public @interface AuditedField {

    /**
     * History record is generated when actual 'root' type is exact same as specified
     * To skip type matching, leave as default
     */
    Class<?> onRootSubtype() default Object.class;

    /**
     *
     * Path to 'root' entity instance
     * if empty, the annotated entity is used itself as 'root'
     *
     */
    String pathToRoot() default "";

    Occasion occasion();

    /**
     *
     * History record is generated when actual type of the field is exact same as specified
     * To skip type matching, leave as default
     *
     */
    Class<?> onFieldSubtype() default Object.class;

    /**
     * Example: "Приоритет изменен с '${#priority.name}' на '${priority.name}'"
     * ${...} - entity graph navigation
     * # - value before
     */
    String template();

    String templateEn() default "";

    enum Occasion {
        ON_UPDATE,
        /**
         * is fired when the value has changed from {@code null} to non-null
         */
        ON_SET,
        /**
         * is fired when the value has changed from non-null to {@code null}
         */
        ON_UNSET
    }

    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.FIELD)
    @Inherited
    @interface Repeat {
        AuditedField[] value();
    }
}



