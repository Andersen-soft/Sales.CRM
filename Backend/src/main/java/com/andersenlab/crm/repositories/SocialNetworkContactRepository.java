package com.andersenlab.crm.repositories;

import com.andersenlab.crm.model.entities.QSocialNetworkContact;
import com.andersenlab.crm.model.entities.SocialNetworkContact;
import com.querydsl.core.BooleanBuilder;
import org.springframework.data.querydsl.binding.QuerydslBindings;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Iterator;

@Repository
public interface SocialNetworkContactRepository extends BaseRepository<QSocialNetworkContact, SocialNetworkContact, Long> {

    @Override
    default void customize(QuerydslBindings bindings, QSocialNetworkContact root) {
        bindings.bind(root.socialNetworkUser.contacts.any().sales.any().createDate).all((path, value) -> {
            Iterator<? extends LocalDateTime> iterator = value.iterator();
            return path.between(iterator.next(), iterator.next());
        });

        bindings.bind(root.socialNetworkUser.name).all((path, values) -> {
            BooleanBuilder predicate = new BooleanBuilder();
            values.stream().map(path::containsIgnoreCase).forEach(predicate::or);
            return predicate;
        });

        bindings.bind(root.searchQuery).first(((path, value) ->
                root.sales.firstName.concat(" ").concat(root.sales.lastName).containsIgnoreCase(value)
                        .or(root.salesAssistant.firstName.concat(" ").concat(root.salesAssistant.lastName).containsIgnoreCase(value))
                        .or(root.source.name.containsIgnoreCase(value))
                        .or(root.socialNetworkUser.name.containsIgnoreCase(value))
        ));

        bindings.bind(root.socialNetworkUser.contacts.any().sales.any().excludedStatus).first((path, value) ->
                root.socialNetworkUser.contacts.any().sales.any().status.ne(value));

    }
}