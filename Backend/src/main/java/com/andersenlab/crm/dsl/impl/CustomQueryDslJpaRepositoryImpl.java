package com.andersenlab.crm.dsl.impl;

import com.andersenlab.crm.dsl.CustomQueryDslJpaRepository;
import com.querydsl.core.types.EntityPath;
import com.querydsl.core.types.Expression;
import com.querydsl.core.types.FactoryExpression;
import com.querydsl.core.types.Predicate;
import com.querydsl.core.types.dsl.PathBuilder;
import com.querydsl.jpa.JPQLQuery;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.support.JpaEntityInformation;
import org.springframework.data.jpa.repository.support.QueryDslJpaRepository;
import org.springframework.data.jpa.repository.support.Querydsl;
import org.springframework.data.querydsl.EntityPathResolver;
import org.springframework.data.querydsl.SimpleEntityPathResolver;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.support.PageableExecutionUtils;

import javax.persistence.EntityManager;
import java.io.Serializable;

@NoRepositoryBean
public class CustomQueryDslJpaRepositoryImpl<T, L extends Serializable> extends QueryDslJpaRepository<T, L>
        implements CustomQueryDslJpaRepository<T, L> {

    private static final EntityPathResolver DEFAULT_ENTITY_PATH_RESOLVER = SimpleEntityPathResolver.INSTANCE;

    private final EntityPath<T> path;
    private final PathBuilder<T> builder;
    private final Querydsl querydsl;

    public CustomQueryDslJpaRepositoryImpl(JpaEntityInformation<T, L> entityInformation, EntityManager entityManager) {
        this(entityInformation, entityManager, DEFAULT_ENTITY_PATH_RESOLVER);
    }

    private CustomQueryDslJpaRepositoryImpl(JpaEntityInformation<T, L> entityInformation, EntityManager entityManager,
                                            EntityPathResolver resolver) {

        super(entityInformation, entityManager);
        this.path = resolver.createPath(entityInformation.getJavaType());
        this.builder = new PathBuilder<>(path.getType(), path.getMetadata());
        this.querydsl = new Querydsl(entityManager, builder);
    }

    @Override
    public Page<T> findAllWithPageable(FactoryExpression<T> factoryExpression, Predicate predicate, Pageable pageable) {
        JPQLQuery countQuery = createQuery(predicate);
        Expression<T> expression = factoryExpression != null ? factoryExpression : path;
        JPQLQuery<T> query = querydsl.applyPagination(pageable, createQuery(predicate).select(expression));
        return PageableExecutionUtils.getPage(query.fetch(), pageable, countQuery::fetchCount);
    }
}
