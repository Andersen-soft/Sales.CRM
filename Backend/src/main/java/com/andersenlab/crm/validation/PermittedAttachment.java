package com.andersenlab.crm.validation;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.ElementType.PARAMETER;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Target({FIELD, PARAMETER})
@Retention(RUNTIME)
@Documented
@Constraint(validatedBy = PermittedAttachmentValidator.class)
public @interface PermittedAttachment {
    String message() default "Unallowed extension. Permitted only following: "
            + "jpg, png, gif, txt, doc, docx, pdf, xls, xlsx, ppt, pptx, odt, ods, odg, odp";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
