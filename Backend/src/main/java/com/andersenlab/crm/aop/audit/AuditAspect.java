package com.andersenlab.crm.aop.audit;

import lombok.AllArgsConstructor;
import lombok.SneakyThrows;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.core.ResolvableType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Component;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.io.Serializable;
import java.lang.annotation.Annotation;
import java.lang.reflect.Field;

@Aspect
@Component
@AllArgsConstructor
public class AuditAspect {

    private final AuditHandler auditHandler;

    @SneakyThrows
    @Around(value = "execution(public * org.springframework.data.repository.CrudRepository+.delete*(..)) " +
            "&& target(repository) " +
            "&& args(arg)",
            argNames = "pjp,arg,repository")
    public Object delete(ProceedingJoinPoint pjp,
                         Object arg,
                         CrudRepository<Object, Serializable> repository) {
        if (isAudited(repository)) {
            return isEntity(arg)
                    ? auditHandler.onDelete(arg, pjp)
                    : auditHandler.onDelete(repository.findOne((Serializable) arg), pjp);
        }
        return pjp.proceed();
    }

    private boolean isEntity(Object arg) {
        return arg.getClass().getAnnotation(Entity.class) != null;
    }

    @SneakyThrows
    @Around(value = "execution(public * org.springframework.data.repository.CrudRepository+.save*(..)) " +
            "&& target(repository) " +
            "&& args(entity)",
            argNames = "pjp,entity,repository")
    public Object saveOrUpdate(ProceedingJoinPoint pjp,
                               Object entity,
                               CrudRepository<Object, Serializable> repository) {
        if (isAudited(repository) && isEntity(entity)) {
            Serializable id = getEntityId(entity);
            return id == null ? auditHandler.onSave(pjp) : auditHandler.onUpdate(pjp, entity, repository, id);
        }
        return pjp.proceed();
    }

    private boolean isAudited(CrudRepository<Object, Serializable> repository) {
        ResolvableType resolvableType = ResolvableType.forClass(repository.getClass()).as(JpaRepository.class);
        ResolvableType generic = resolvableType.getGeneric(0);
        Class<?> entityType = generic.resolve();
        return auditHandler.isManagedEntity(entityType);
    }

    private Serializable getEntityId(Object entity) throws IllegalAccessException {
        Field field = findIdField(entity.getClass());
        field.setAccessible(true);
        return (Serializable) field.get(entity);
    }

    private Field findIdField(Class<?> type) {
        for (Field field : type.getDeclaredFields()) {
            Annotation[] annotations = field.getAnnotations();
            for (Annotation a : annotations) {
                if (a.annotationType() == Id.class)
                    return field;
            }
        }
        return findIdField(type.getSuperclass());
    }
}
