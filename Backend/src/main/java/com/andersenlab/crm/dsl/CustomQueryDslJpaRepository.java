package com.andersenlab.crm.dsl;

import com.querydsl.core.types.FactoryExpression;
import com.querydsl.core.types.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QueryDslPredicateExecutor;
import org.springframework.data.repository.NoRepositoryBean;

import java.io.Serializable;

@NoRepositoryBean
public interface CustomQueryDslJpaRepository <T, L extends Serializable>
        extends JpaRepository<T, L>, QueryDslPredicateExecutor<T> {

    Page<T> findAllWithPageable(FactoryExpression<T> factoryExpression, Predicate predicate, Pageable pageable);
}