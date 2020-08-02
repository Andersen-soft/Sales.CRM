package com.andersenlab.crm.aop.audit;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Annotated field will be passed as title argument
 * to generate history message
 *
 * To get string representation will be used
 * {@code Object.toString()}. If the value
 * is {@code null} - null will be passed as argument
 *
 * @see Change#title
 * @see Change#toString()
 * @see Audited#withTitle()
 *
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface AuditTitle {
}
