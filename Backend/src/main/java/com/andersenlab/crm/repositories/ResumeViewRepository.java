package com.andersenlab.crm.repositories;

import com.andersenlab.crm.model.view.ResumeView;
import com.andersenlab.crm.model.view.QResumeView;
import org.springframework.data.querydsl.binding.QuerydslBindings;

import static com.andersenlab.crm.utils.PredicateHelper.emptyIfNull;

public interface ResumeViewRepository extends BaseRepository<QResumeView, ResumeView, Long> {
    @Override
    default void customize(QuerydslBindings bindings, QResumeView root) {
        bindStringAndLong(bindings, root);

        bindings.bind(root.createDate).all(this::getDatePredicate);

        bindings.bind(root.resumeRequest.name).first((path, value) ->
                root.resumeRequest.id.stringValue()
                        .concat(" - ")
                        .concat(emptyIfNull(root.resumeRequest.name)).containsIgnoreCase(value));
    }
}
