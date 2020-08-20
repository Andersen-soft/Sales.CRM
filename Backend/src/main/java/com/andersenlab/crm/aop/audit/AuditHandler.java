package com.andersenlab.crm.aop.audit;

import com.andersenlab.crm.model.entities.History;
import lombok.AllArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.log4j.Log4j2;
import org.apache.commons.beanutils.PropertyUtils;
import org.apache.commons.beanutils.PropertyUtilsBean;
import org.apache.commons.lang3.tuple.ImmutablePair;
import org.apache.commons.lang3.tuple.Pair;
import org.aspectj.lang.ProceedingJoinPoint;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.persistence.EntityManager;
import javax.persistence.metamodel.Bindable;
import javax.persistence.metamodel.EntityType;
import java.io.Serializable;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collection;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static com.andersenlab.crm.utils.CrmStringUtils.escapeDollarsAndSlashes;
import static java.util.Optional.ofNullable;

@Log4j2
@Component
@AllArgsConstructor
@SuppressWarnings("unchecked")
public class AuditHandler {
    public static final String ERROR_WHILE_PROCESSING_ENTITY = "Error while processing entity: %s";
    public static final String FIELD_IS_ACTIVE = "isActive";
    private final AuditorService auditorService;
    private final EntityManager entityManager;
    private final Map<Class<?>, Set<String>> auditMap = new HashMap<>();
    private final Map<Class<?>, List<Audited>> auditCreateEntityMap = new HashMap<>();
    private final Map<Class<?>, List<Audited>> auditDeleteEntityMap = new HashMap<>();

    private final Map<Pair<Class<?>, String>, List<AuditedField>> auditFieldMap = new HashMap<>();
    private final Map<Pair<Class<?>, String>, List<AuditedField>> auditAllFieldMap = new HashMap<>();

    @PostConstruct
    public void fillAuditMap() {
        Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();
        entities.stream()
                .map(Bindable::getBindableJavaType)
                .filter(entityClass -> entityClass.isAnnotationPresent(Audited.class)
                        || entityClass.isAnnotationPresent(Audited.Repeat.class))
                .forEach(entityClass ->
                        auditCreateEntityMap.put(entityClass,
                                ofNullable(entityClass.getAnnotation(Audited.Repeat.class))
                                        .map(v -> Stream.of(v.value()))
                                        .orElse(Stream.of(entityClass.getAnnotation(Audited.class)))
                                        .filter(annotation -> annotation.occasion() == Audited.Occasion.ON_CREATE)
                                        .collect(Collectors.toList())));
        entities.stream()
                .map(Bindable::getBindableJavaType)
                .filter(entityClass -> entityClass.isAnnotationPresent(Audited.class)
                        || entityClass.isAnnotationPresent(Audited.Repeat.class))
                .forEach(entityClass ->
                        auditDeleteEntityMap.put(entityClass,
                                ofNullable(entityClass.getAnnotation(Audited.Repeat.class))
                                        .map(v -> Stream.of(v.value()))
                                        .orElse(Stream.of(entityClass.getAnnotation(Audited.class)))
                                        .filter(annotation -> annotation.occasion() == Audited.Occasion.ON_DELETE)
                                        .collect(Collectors.toList())));
        auditAllFieldMap.putAll(entities.stream()
                .map(Bindable::getBindableJavaType).flatMap(v -> Stream.of(v.getDeclaredFields())
                        .map(field -> new ImmutablePair<Class, Field>(v, field)))
                .collect(Collectors.toMap(v -> new ImmutablePair<>(v.getLeft(), v.getRight().getName()),
                        v -> Stream.of(v.getValue().getAnnotationsByType(AuditedField.class))
                                .collect(Collectors.toList()))));
        //field annotation inheritance
        entities.stream().map(Bindable::getBindableJavaType).forEach(aClass ->
                auditAllFieldMap.keySet()
                        .stream()
                        .filter(classFieldPair1 -> classFieldPair1.getKey()
                                .isAssignableFrom(aClass))
                        .forEach(classStringPair -> {
                            if (!auditAllFieldMap.get(classStringPair).isEmpty()) {
                                auditFieldMap.put(new ImmutablePair<>(aClass, classStringPair.getValue()), auditAllFieldMap.get(classStringPair));
                                populateAuditMap(aClass, classStringPair.getValue());
                            }

                        })
        );

    }

    @SneakyThrows
    public Object onDelete(Object entity, ProceedingJoinPoint pjp) {
        processDeletion(entity);
        return pjp.proceed();
    }

    @SneakyThrows
    public Object onSave(ProceedingJoinPoint pjp) {
        Object entity = pjp.proceed();
        List<Audited> entityAnnotations = auditCreateEntityMap.get(entity.getClass());
        if (entityAnnotations != null) {
            try {
                processEntityAnnotations(entity, entityAnnotations);
            } catch (ReflectiveOperationException e) {
                log.error(String.format(ERROR_WHILE_PROCESSING_ENTITY, entity.getClass()), e);
            }
        }
        return entity;
    }

    @SneakyThrows
    public Object onUpdate(ProceedingJoinPoint pjp,
                           Object entity,
                           CrudRepository<Object, Serializable> repository,
                           Serializable id) {
        if (!isManagedEntity(entity.getClass())) {
            return pjp.proceed();
        }
        entityManager.detach(entity);
        Set<String> fieldsToCompare = Optional.ofNullable(auditMap.get(entity.getClass())).orElse(new HashSet<>());
        Object old = repository.findOne(id);
        Map<String, Object> oldValues = getAuditedFieldMap(old);
        entityManager.detach(old);
        Object proceed = pjp.proceed();
        Map<String, Object> newValues = getAuditedFieldMap(proceed);
        entityManager.detach(proceed);
        fieldsToCompare
                .forEach(cField -> {
                    Object left = oldValues.get(cField);
                    Object right = newValues.get(cField);
                    if (fieldNotEquals(left, right)) {
                        processFieldUpdate(entity, old, proceed, cField, left, right);
                    }
                });
        //trigger ON_DELETE if entity marked as deleted
        if (isReachable(proceed, FIELD_IS_ACTIVE)) {
            PropertyUtilsBean pub = new PropertyUtilsBean();
            Object isActiveBefore = pub.getProperty(old, FIELD_IS_ACTIVE);
            Object isActiveAfter = pub.getProperty(proceed, FIELD_IS_ACTIVE);
            if (isActiveBefore != isActiveAfter && isActiveAfter == Boolean.FALSE) {
                processDeletion(proceed);
            }
        }
        return proceed;
    }

    @SneakyThrows
    private Map<String, Object> getAuditedFieldMap(Object object) {
        PropertyUtilsBean pub = new PropertyUtilsBean();
        Map<String, Object> fieldMap = new HashMap<>();
        if (auditMap.containsKey(object.getClass())) {
            Set<String> fields = auditMap.get(object.getClass());
            for (String field : fields) {
                fieldMap.put(field, pub.getProperty(object, field));
            }
        }
        return fieldMap;
    }

    private void processDeletion(Object entity) {
        try {
            List<Audited> entityAnnotations = auditDeleteEntityMap.get(auditDeleteEntityMap.keySet().stream()
                    .filter(k -> k.isAssignableFrom(entity.getClass()))
                    .sorted(Comparator.comparing(v -> v, (k1, k2) -> k1.isAssignableFrom(k2) ? 1 : -1)).findFirst().orElse(null));
            if (entityAnnotations != null) {
                processEntityAnnotations(entity, entityAnnotations);
            }
        } catch (ReflectiveOperationException e) {
            Class entityClass = Optional.ofNullable(entity).map(Object::getClass).orElse(null);
            log.error(String.format(ERROR_WHILE_PROCESSING_ENTITY, entityClass), e);
        }
    }

    private void processEntityAnnotations(Object entity, Collection<Audited> auditedEntity2s) throws IllegalAccessException, NoSuchMethodException, InvocationTargetException {
        for (Audited entity2 : auditedEntity2s) {
            PropertyUtilsBean pub = new PropertyUtilsBean();
            Object root;
            if (entity2.pathToRoot().isEmpty()) {
                root = entity;
            } else {
                if (!isReachable(entity, entity2.pathToRoot())) {
                    continue;
                }
                root = pub.getProperty(entity, entity2.pathToRoot());
            }
            if (root != null && (entity2.onRootSubtype() == Object.class ||
                    root.getClass().equals(entity2.onRootSubtype()))) {
                generateHistory(null, entity, root, entity2.template(), entity2.templateEn());
            }

        }
    }

    private boolean isReachable(Object object, String path) throws IllegalAccessException, NoSuchMethodException, InvocationTargetException {
        PropertyUtilsBean pub = new PropertyUtilsBean();
        String[] steps = path.split("\\.");
        StringBuilder journey = new StringBuilder();
        boolean isPrevNull = false;
        for (String step : steps) {
            if (journey.length() > 0) {
                journey.append(".");
            }
            journey.append(step);
            String cPath = journey.toString();
            if (isPrevNull || !PropertyUtils.isReadable(object, cPath)) {
                return false;
            } else {
                isPrevNull = pub.getProperty(object, cPath) == null;
            }

        }
        return true;
    }

    private String generateRecord(Object entityAfter, Object entityBefore, PropertyUtilsBean pub, String record)
            throws IllegalAccessException, InvocationTargetException, NoSuchMethodException {
        List<String> paths = new LinkedList<>();
        Pattern pattern = Pattern.compile("[^{\\}]+(?=})");
        Matcher matcher = pattern.matcher(record);
        while (matcher.find()) {
            paths.add(matcher.group());
        }
        for (String path : paths) {
            Object v;
            if (path.startsWith("#")) {
                String relativePath = path.replace("#", "");
                v = isReachable(entityBefore, relativePath) ? pub.getProperty(entityBefore, relativePath) : null;
            } else {
                v = isReachable(entityAfter, path) ? pub.getProperty(entityAfter, path) : null;
            }
            record = record.replaceAll("\\$\\{" + path + "}", getStringValue(v));
        }
        return record;
    }

    private String getStringValue(Object o) {
        if (o instanceof Enum) {
            return ((Enum) o).name();
        }
        if (o instanceof LocalDateTime) {
            return ((LocalDateTime) o).format(DateTimeFormatter.ofPattern("dd.MM.yyyy"));
        }
        if (o == null) {
            return "Отсутствует";
        }
        return escapeDollarsAndSlashes(o.toString());
    }

    private void processFieldUpdate(Object entity, Object before, Object after, String cField, Object left, Object right) {
        if (left == null) {
            ofNullable(auditFieldMap.get(new ImmutablePair(entity.getClass(), cField)))
                    .map(Collection::parallelStream)
                    .orElse(Stream.empty())
                    .filter(auditedField -> auditedField.occasion() == AuditedField.Occasion.ON_SET)
                    .filter(entity2 -> matchAnnotation(after, entity2))
                    .forEach(entity2 -> mapAnnotation(after, before, entity2));
        } else if (right == null) {
            ofNullable(auditFieldMap.get(new ImmutablePair(entity.getClass(), cField)))
                    .map(Collection::parallelStream)
                    .orElse(Stream.empty())
                    .filter(auditedField -> auditedField.occasion() == AuditedField.Occasion.ON_UNSET)
                    .filter(entity2 -> matchAnnotation(after, entity2))
                    .forEach(entity2 -> mapAnnotation(after, before, entity2));
        } else {
            ofNullable(auditFieldMap.get(new ImmutablePair(entity.getClass(), cField)))
                    .map(Collection::parallelStream)
                    .orElse(Stream.empty())
                    .filter(auditedField -> auditedField.occasion() == AuditedField.Occasion.ON_UPDATE)
                    .filter(entity2 -> matchAnnotation(after, entity2))
                    .forEach(entity2 -> mapAnnotation(after, before, entity2));
        }
    }

    private void mapAnnotation(Object entityAfter, Object entityBefore, AuditedField entity2) {
        try {
            PropertyUtilsBean pub = new PropertyUtilsBean();
            Object root;
            if (entity2.pathToRoot().isEmpty()) {
                root = entityAfter;
            } else {
                root = pub.getProperty(entityAfter, entity2.pathToRoot());
            }
            generateHistory(entityBefore, entityAfter, root, entity2.template(), entity2.templateEn());
        } catch (ReflectiveOperationException e) {
            log.error(String.format(ERROR_WHILE_PROCESSING_ENTITY, entity2.getClass()), e);
        }
    }

    private boolean matchAnnotation(Object entityAfter, AuditedField entity2) {
        try {
            PropertyUtilsBean pub = new PropertyUtilsBean();
            Object root;
            if (entity2.pathToRoot().isEmpty()) {
                root = entityAfter;
            } else {
                if (!isReachable(entityAfter, entity2.pathToRoot())
                        || pub.getProperty(entityAfter, entity2.pathToRoot()) == null) {
                    return false;
                }
                root = pub.getProperty(entityAfter, entity2.pathToRoot());
            }
            if ((entity2.onRootSubtype() == Object.class
                    || Objects.equals(root.getClass(), entity2.onRootSubtype()))
                    && (entity2.onFieldSubtype() == Object.class
                    || Objects.equals(entity2.onFieldSubtype(), entityAfter.getClass()))) {
                return true;
            }
        } catch (ReflectiveOperationException e) {
            log.error(String.format(ERROR_WHILE_PROCESSING_ENTITY, entity2.getClass()), e);
        }
        return false;
    }

    private void generateHistory(
            Object entityBefore,
            Object entityAfter,
            Object root,
            String template,
            String templateEn
    ) {
        try {
            PropertyUtilsBean pub = new PropertyUtilsBean();

            History history = auditorService.createHistory(root);
            String record = template;
            record = generateRecord(entityAfter, entityBefore, pub, record);
            history.setDescription(record);

            if (!templateEn.isEmpty()) {
                String recordEn = templateEn;
                recordEn = generateRecord(entityAfter, entityBefore, pub, recordEn);
                history.setDescriptionEn(recordEn);
            }

            auditorService.saveHistory(history);
        } catch (ReflectiveOperationException e) {
            Class entityAfterClass = Optional.ofNullable(entityAfter).map(Object::getClass).orElse(null);
            log.error(String.format(ERROR_WHILE_PROCESSING_ENTITY, entityAfterClass), e);
        }
    }

    private boolean fieldNotEquals(Object left, Object right) {
        if (left == null && right == null) {
            return false;
        }
        if (left instanceof LocalDateTime && right instanceof LocalDateTime) {
            return !((LocalDateTime) left).toLocalDate().isEqual(((LocalDateTime) right).toLocalDate());
        }
        return !Objects.equals(left, right);
    }

    private void populateAuditMap(Class<?> entityClass, String cField) {
        auditMap.computeIfAbsent(entityClass, k -> new HashSet<>()).add(cField);
    }

    public boolean isManagedEntity(Class<?> entityType) {
        return auditMap.keySet().stream().anyMatch(entityType::isAssignableFrom) ||
                auditCreateEntityMap.keySet().stream().anyMatch(entityType::isAssignableFrom) ||
                auditDeleteEntityMap.keySet().stream().anyMatch(entityType::isAssignableFrom);
    }
}
