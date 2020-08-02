package com.andersenlab.crm.aop;

import com.andersenlab.crm.exceptions.CrmAuthException;
import com.andersenlab.crm.exceptions.CrmException;
import com.andersenlab.crm.exceptions.ResourceNotFoundException;
import com.andersenlab.crm.model.RoleEnum;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.model.entities.Responsible;
import com.andersenlab.crm.model.entities.Role;
import com.andersenlab.crm.security.AuthenticatedUser;
import com.andersenlab.crm.utils.StreamUtils;
import lombok.AllArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.reflect.FieldUtils;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;

import javax.persistence.EntityManager;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Aspect
@Component
@AllArgsConstructor
public class RoleCheckAspect {

    private static final String ILLEGAL_EXCEPTION = "Can't read fields value. Field {}. Error {}";
    private final AuthenticatedUser authenticatedUser;
    private final EntityManager entityManager;

    @SneakyThrows
    @Around(value = "execution(public * com.andersenlab.crm.rest.controllers.BaseController+.*(..)) " +
            "&& !execution(* com.andersenlab.crm.rest.controllers.CountryController.getCountries(..))" +
            "&& !execution(* com.andersenlab.crm.rest.controllers.CompanySaleController.createExpressSale(..))" +
            "&& !execution(* com.andersenlab.crm.rest.controllers.CompanySaleController.createExpressSaleByEmail(..))" +
            "&& !execution(* com.andersenlab.crm.rest.controllers.EmployeeController.getEmployeesForMailExpressSale(..))" +
            "&& !execution(* com.andersenlab.crm.rest.controllers.CompanySaleGoogleAdRecordController.exportGoogleAdRecords(..))" +
            "|| @annotation(HasRole)",
            argNames = "pjp")
    public Object checkRoles(ProceedingJoinPoint pjp) {
        Set<RoleEnum> currentUserRoles = getCurrentUserRoles();
        Object[] args = pjp.getArgs();
        checkMethodRoles(pjp, currentUserRoles, args);
        checkArgsRoles(args, currentUserRoles);
        return pjp.proceed();
    }

    private void checkMethodRoles(ProceedingJoinPoint pjp, Set<RoleEnum> currentUserRoles, Object[] args) {
        Method method = ((MethodSignature) pjp.getSignature()).getMethod();
        HasRole hasRole = method.getAnnotation(HasRole.class);
        Optional.ofNullable(hasRole)
                .map(HasRole::roles)
                .ifPresent(methodsRoles -> checkAuthorities(currentUserRoles, args, hasRole, methodsRoles));
    }

    private void checkAuthorities(Set<RoleEnum> currentUserRoles, Object[] args, HasRole hasRole, RoleEnum[] methodsRoles) {
        checkRolesMatch(currentUserRoles, methodsRoles);
        Optional.ofNullable(getResponsibleFor(hasRole))
                .ifPresent(responsibleFor -> checkResponsible(currentUserRoles, methodsRoles, responsibleFor, args));
    }

    private void checkArgsRoles(Object[] args, Set<RoleEnum> currentUserRoles) {
        StreamUtils.streamOf(args)
                .filter(Objects::nonNull)
                .forEach(o -> checkRoles(o, currentUserRoles, args));
    }

    private void checkRoles(Object o, Set<RoleEnum> currentUserRoles, Object[] args) {
        StreamUtils.streamOf(FieldUtils.getAllFields(o.getClass()))
                .filter(field -> field.getAnnotation(HasRole.class) != null)
                .filter(field -> readField(o, field) != null)
                .forEach(field -> {
                    HasRole fieldAnnotation = field.getAnnotation(HasRole.class);
                    RoleEnum[] roles = fieldAnnotation.roles();
                    checkAuthorities(currentUserRoles, args, fieldAnnotation, roles);
                });
    }

    private Object readField(Object o, Field field) {
        try {
            return FieldUtils.readField(field, o, true);
        } catch (IllegalAccessException e) {
            log.error(ILLEGAL_EXCEPTION, field, e);
            throw new CrmException("Can't read field value");
        }
    }

    private void checkResponsible(Set<RoleEnum> currentUserRoles,
                                  RoleEnum[] roles,
                                  ResponsibleFor responsibleFor,
                                  Object[] args) {
        if (responsibleFor == null || !isRoleForResponsibleCheck(currentUserRoles, roles)) {
            return;
        }
        if (args == null || args.length < 2) {
            throw new ResourceNotFoundException("There are no arguments for responsible check");
        }
        Long currentUserId = authenticatedUser.getCurrentEmployee().getId();
        Long entityId = getEntityId(args);
        Responsible entity = entityManager.find(responsibleFor.entityClass(), entityId);
        if ((entity == null || !Objects.equals(currentUserId, entity.getResponsible().getId()))
                && !currentUserRoles.contains(RoleEnum.ROLE_ADMIN)) {
            throw new CrmAuthException("You don't have permission for this action");
        }
    }

    private boolean isRoleForResponsibleCheck(Set<RoleEnum> currentUserRoles, RoleEnum[] roles) {
        return !currentUserRoles.contains(RoleEnum.ROLE_ADMIN)
                || currentUserRoles.contains(RoleEnum.ROLE_SALES) &&
                StreamUtils.streamOf(roles)
                        .anyMatch(RoleEnum.ROLE_SALES::equals);
    }

    private ResponsibleFor getResponsibleFor(HasRole hasRole) {
        ResponsibleFor[] responsibles = hasRole.responsibleFor();
        return StreamUtils.streamOf(responsibles)
                .findFirst()
                .orElse(null);
    }

    private Long getEntityId(Object[] args) {
        return StreamUtils.streamOf(args)
                .filter(arg -> arg instanceof Long)
                .map(arg -> (Long) arg)
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Entity id not found"));
    }

    private void checkRolesMatch(Set<RoleEnum> currentUserRoles, RoleEnum[] roles) {
        if (currentUserRoles.stream().noneMatch(Arrays.asList(roles)::contains)) {
            throw new CrmAuthException("You don't have permission for this action");
        }
    }

    private Set<RoleEnum> getCurrentUserRoles() {
        return Optional.ofNullable(authenticatedUser.getCurrentEmployee())
                .map(Employee::getRoles)
                .orElseThrow(() -> new CrmAuthException("User without roles"))
                .stream()
                .map(Role::getName)
                .collect(Collectors.toSet());
    }
}
