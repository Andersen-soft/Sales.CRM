package com.andersenlab.crm.repositories;

import com.andersenlab.crm.model.view.QSocialNetworkAnswerSalesHeadView;
import com.andersenlab.crm.model.view.SocialNetworkAnswerSalesHeadView;
import com.querydsl.core.types.Predicate;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.querydsl.binding.QuerydslBindings;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

import static com.andersenlab.crm.utils.PredicateHelper.emptyIfNull;

public interface SocialNetworkAnswerSalesHeadViewRepository extends BaseRepository<QSocialNetworkAnswerSalesHeadView, SocialNetworkAnswerSalesHeadView, Long> {
    @Override
    default void customize(QuerydslBindings bindings, QSocialNetworkAnswerSalesHeadView root) {
        bindStringAndLong(bindings, root);

        bindings.bind(root.createDate).all(this::getDatePredicate);

        bindings.bind(root.search).first((t, h) -> defineSearchPredicate(h));
    }

    static Predicate defineSearchPredicate(String value) {
        QSocialNetworkAnswerSalesHeadView view = QSocialNetworkAnswerSalesHeadView.socialNetworkAnswerSalesHeadView;
        return view.status.stringValue().containsIgnoreCase(value)
                .or(emptyIfNull(view.assistant.firstName)
                        .concat(" ")
                        .concat(emptyIfNull(view.assistant.lastName))
                        .containsIgnoreCase(value))
                .or(emptyIfNull(view.responsible.firstName)
                        .concat(" ")
                        .concat(emptyIfNull(view.responsible.lastName))
                        .containsIgnoreCase(value))
                .or(emptyIfNull(view.source.name).containsIgnoreCase(value))
                .or(emptyIfNull(view.socialNetworkContact.socialNetworkUser.name)
                        .containsIgnoreCase(value))
                .or(emptyIfNull(view.message).containsIgnoreCase(value))
                .or(emptyIfNull(view.linkLead).containsIgnoreCase(value))
                .or(emptyIfNull(view.firstName).containsIgnoreCase(value))
                .or(emptyIfNull(view.lastName).containsIgnoreCase(value))
                .or(emptyIfNull(view.sex.stringValue()).containsIgnoreCase(value))
                .or(emptyIfNull(view.country.nameRu).containsIgnoreCase(value))
                .or(emptyIfNull(view.country.nameEn).containsIgnoreCase(value))
                .or(emptyIfNull(view.companyName).containsIgnoreCase(value));
    }

    @Query("SELECT view.status as status, count(status) as count \n" +
            "from SocialNetworkAnswerSalesHeadView view \n" +
            "where view.createDate BETWEEN :creationFrom AND :creationTo \n" +
            "group by status")
    List<Object[]> getStatistic(
            @Param("creationFrom") LocalDateTime creationFrom,
            @Param("creationTo") LocalDateTime creationTo
    );

}
