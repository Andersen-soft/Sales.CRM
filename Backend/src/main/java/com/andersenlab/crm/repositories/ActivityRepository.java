package com.andersenlab.crm.repositories;

import com.andersenlab.crm.model.entities.Activity;
import com.andersenlab.crm.model.entities.ActivityReport;
import com.andersenlab.crm.model.entities.Contact;
import com.andersenlab.crm.model.entities.QActivity;
import com.andersenlab.crm.model.entities.QContact;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;
import org.springframework.data.querydsl.binding.QuerydslBindings;
import org.springframework.data.repository.query.Param;

import java.util.List;

import static com.andersenlab.crm.utils.PredicateHelper.emptyIfNull;

public interface ActivityRepository extends BaseRepository<QActivity, Activity, Long> {
    @Override
    default void customize(QuerydslBindings bindings, QActivity root) {
        bindStringAndLong(bindings, root);

        bindings.bind(root.dateActivity).all(this::getDatePredicate);

        bindings.bind(root.search).first((stringSimplePath, s) -> getSearchPredicate(s));
    }

    default Predicate getSearchPredicate(String value) {
        QActivity activity = QActivity.activity;
        QContact contact = activity.contacts.any();
        BooleanBuilder predicate = new BooleanBuilder();
        for (String word : value.trim().split(" ")) {
            predicate = predicate
                    .or(emptyIfNull(activity.companySale.id.stringValue())
                            .containsIgnoreCase(word))
                    .or(emptyIfNull(activity.companySale.companyName)
                            .containsIgnoreCase(word))
                    .or(emptyIfNull(activity.description).containsIgnoreCase(word))
                    .or(emptyIfNull(contact.firstName).containsIgnoreCase(word))
                    .or(emptyIfNull(contact.lastName).containsIgnoreCase(word));
        }
        return predicate;
    }

    List<Activity> findByContactsIn(Iterable<Contact> contacts);

    List<ActivityReport> getActivityReport(@Param("reportFrom") String reportFrom, @Param("reportTo") String reportTo);

    boolean existsActivityByResponsibleId(Long id);
}
