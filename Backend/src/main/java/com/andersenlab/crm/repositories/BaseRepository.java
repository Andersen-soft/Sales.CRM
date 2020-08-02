package com.andersenlab.crm.repositories;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.EntityPath;
import com.querydsl.core.types.Predicate;
import com.querydsl.core.types.dsl.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QueryDslPredicateExecutor;
import org.springframework.data.querydsl.binding.MultiValueBinding;
import org.springframework.data.querydsl.binding.QuerydslBinderCustomizer;
import org.springframework.data.querydsl.binding.QuerydslBindings;
import org.springframework.data.repository.NoRepositoryBean;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import static com.andersenlab.crm.model.entities.SqlConstants.CONVERT_TO_CHAR;

@NoRepositoryBean
public interface BaseRepository<E extends EntityPath<T>, T, I extends Serializable> extends JpaRepository<T, I>,
        QueryDslPredicateExecutor<T>, QuerydslBinderCustomizer<E> {

    /**
     * Describes general logic for filtering. Matches values for string occurrences
     */
    @Override
    default void customize(QuerydslBindings bindings, E root) {
        bindStringAndLong(bindings, root);
    }

    default void bindStringAndLong(QuerydslBindings bindings, E root) {
        bindString(bindings, root);

        bindings.bind(Long.class).all((path, values) -> {
            StringTemplate template = Expressions.stringTemplate(CONVERT_TO_CHAR, path);
            return values.stream()
                    .map(Object::toString)
                    .map(template::contains)
                    .collect(BooleanBuilder::new, BooleanBuilder::or, BooleanBuilder::or);
        });
    }

    default void bindString(QuerydslBindings bindings, E root) {
        bindings.bind(String.class).all((MultiValueBinding<StringPath, String>) (path, values) -> {
            BooleanBuilder predicate = new BooleanBuilder();
            values.forEach(value -> predicate.or(path.containsIgnoreCase(value)));
            return predicate;
        });
    }

    default Predicate getDatePredicate(DateTimePath path, Collection value) {
        List<? extends LocalDateTime> dates = new ArrayList<>(value);
        if (dates.size() == 1) {
            return path.between(
                    dates.get(0).toLocalDate().atTime(LocalTime.MIN),
                    dates.get(0).toLocalDate().atTime(LocalTime.MAX));
        } else {
            return path.between(
                    dates.get(0).toLocalDate().atTime(LocalTime.MIN),
                    dates.get(1).toLocalDate().atTime(LocalTime.MAX));
        }
    }

    default Predicate getNullOrNotNullPredicate(SimpleExpression path, String value) {
        if ("null".equalsIgnoreCase(value)) {
            return path.isNull().or(path.eq(""));
        }
        if ("notNull".equalsIgnoreCase(value)) {
            return path.isNotNull().and(path.ne(""));
        }
        return null;
    }

    default Predicate getNullOrNotNullPredicate(SimpleExpression path, Collection values) {
        BooleanBuilder predicate = new BooleanBuilder();
        values.forEach(value -> predicate.or(getNullOrNotNullPredicate(path, (String)value)));
        return predicate;
    }
}
