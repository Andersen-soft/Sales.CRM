package com.andersenlab.crm.repositories;

import com.andersenlab.crm.model.entities.QSocialNetworkUser;
import com.andersenlab.crm.model.entities.SocialNetworkUser;
import org.springframework.data.querydsl.binding.QuerydslBindings;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Iterator;

@Repository
public interface SocialNetworkUserRepository extends BaseRepository<QSocialNetworkUser, SocialNetworkUser, Long> {

    @Override
    default void customize(QuerydslBindings bindings, QSocialNetworkUser root) {
        bindings.bind(root.contacts.any().sales.any().createDate).all((path, value) -> {
            Iterator<? extends LocalDateTime> iterator = value.iterator();
            return path.between(iterator.next(), iterator.next());
        });

        bindings.bind(root.contacts.any().sales.any().statusChangedDate).all(this::getDatePredicate);

        bindings.bind(root.contacts.any().sales.any().createDate).all(this::getDatePredicate);
    }
}
