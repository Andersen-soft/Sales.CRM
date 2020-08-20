package com.andersenlab.crm.aop.audit;

import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Repeatable;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * History is generated and stored for the 'root' entity being specified by {@code pathToRoot()}
 * in context of entity lifecycle events
 *
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@Repeatable(Audited.Repeat.class)
@Inherited
public @interface Audited {

    /**
     * @see AuditedField#onRootSubtype()
     */
    Class<?> onRootSubtype() default Object.class;

    /**
     *
     * @see AuditedField#pathToRoot()
     */
    String pathToRoot() default "";

    Occasion occasion();

    /**
     * Example: "Приоритет изменен с '${#priority.name}' на '${priority.name}'"
     * ${...} - entity graph navigation
     * # - value before
     */
    String template();

    String templateEn() default "";

    enum Occasion {
        ON_CREATE,
        ON_DELETE
    }

    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.TYPE)
    @Inherited
    @interface Repeat {
        Audited[] value();
    }
}



