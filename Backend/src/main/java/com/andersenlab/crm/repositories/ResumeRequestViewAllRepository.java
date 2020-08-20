package com.andersenlab.crm.repositories;

import com.andersenlab.crm.model.view.AllResumeRequestsView;
import com.andersenlab.crm.model.view.QAllResumeRequestsView;
import com.querydsl.core.types.dsl.SimpleExpression;
import org.springframework.data.querydsl.binding.QuerydslBindings;

import static com.andersenlab.crm.utils.PredicateHelper.emptyIfNull;

public interface ResumeRequestViewAllRepository extends BaseRepository<QAllResumeRequestsView, AllResumeRequestsView, Long> {

    @Override
    default void customize(QuerydslBindings bindings, QAllResumeRequestsView root) {
        bindStringAndLong(bindings, root);

        bindings.bind(root.companyId).first(SimpleExpression::eq);

        bindings.bind(root.responsibleId).first(SimpleExpression::eq);

        bindings.bind(root.responsibleForSaleRequestId).first(SimpleExpression::eq);

        bindings.bind(root.name).first((path, value) ->
                root.resumeRequestId.stringValue()
                        .concat(" - ")
                        .concat(emptyIfNull(root.name)).containsIgnoreCase(value));

        bindings.bind(root.createDate).all(this::getDatePredicate);
    }

    AllResumeRequestsView findByIsActiveIsTrueAndResumeRequestId(Long id);
}