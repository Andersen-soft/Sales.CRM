package com.andersenlab.crm.repositories;

import com.andersenlab.crm.model.entities.QResumeRequestView;
import com.andersenlab.crm.model.entities.ResumeRequestView;
import org.springframework.data.querydsl.binding.QuerydslBindings;

import java.time.LocalDateTime;
import java.util.Iterator;

public interface ResumeRequestViewRepository extends BaseRepository<QResumeRequestView, ResumeRequestView, Long> {

    @Override
    default void customize(QuerydslBindings bindings, QResumeRequestView root) {
        bindStringAndLong(bindings, root);

        bindings.bind(root.doneDate).all((path, value) -> {
            Iterator<? extends LocalDateTime> iterator = value.iterator();
            return path.between(iterator.next(), iterator.next());
        });
    }
}
