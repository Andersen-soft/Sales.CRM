package com.andersenlab.crm.repositories;

import com.andersenlab.crm.model.entities.QSocialNetworkAnswer;
import com.andersenlab.crm.model.entities.SocialNetworkAnswer;
import com.andersenlab.crm.rest.response.RatingNCResponse;
import com.querydsl.core.types.Predicate;
import com.querydsl.core.types.dsl.SimplePath;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.querydsl.binding.QuerydslBindings;
import org.springframework.data.repository.query.Param;

import java.util.Date;

import static com.andersenlab.crm.utils.PredicateHelper.emptyIfNull;

public interface SocialNetworkAnswerRepository extends BaseRepository<QSocialNetworkAnswer, SocialNetworkAnswer, Long> {

    @Override
    default void customize(QuerydslBindings bindings, QSocialNetworkAnswer root) {
        bindStringAndLong(bindings, root);

        bindings.bind(root.createDate).all(this::getDatePredicate);

        bindings.bind(root.search).first(this::getSearchPredicate);

    }

    default Predicate getSearchPredicate(SimplePath<String> path,  String value) {
        QSocialNetworkAnswer view = QSocialNetworkAnswer.socialNetworkAnswer;
        return emptyIfNull(view.assistant.firstName)
                        .concat(" ")
                        .concat(emptyIfNull(view.assistant.lastName))
                        .containsIgnoreCase(value)
                .or(emptyIfNull(view.socialNetworkContact.sales.firstName)
                        .concat(" ")
                        .concat(emptyIfNull(view.socialNetworkContact.sales.lastName))
                        .containsIgnoreCase(value))
                .or(emptyIfNull(view.socialNetworkContact.source.name).containsIgnoreCase(value))
                .or(emptyIfNull(view.socialNetworkContact.socialNetworkUser.name).containsIgnoreCase(value))
                .or(emptyIfNull(view.message).containsIgnoreCase(value))
                .or(emptyIfNull(view.linkLead).containsIgnoreCase(value))
                .or(emptyIfNull(view.firstName).containsIgnoreCase(value))
                .or(emptyIfNull(view.lastName).containsIgnoreCase(value))
                .or(emptyIfNull(view.sex.stringValue()).containsIgnoreCase(value))
                .or(emptyIfNull(view.position).containsIgnoreCase(value))
                .or(emptyIfNull(view.country.nameRu).containsIgnoreCase(value))
                .or(emptyIfNull(view.country.nameEn).containsIgnoreCase(value))
                .or(emptyIfNull(view.skype).containsIgnoreCase(value))
                .or(emptyIfNull(view.email).containsIgnoreCase(value))
                .or(emptyIfNull(view.emailPrivate).containsIgnoreCase(value))
                .or(emptyIfNull(view.phone).containsIgnoreCase(value))
                .or(emptyIfNull(view.companyName).containsIgnoreCase(value))
                .or(emptyIfNull(view.site).containsIgnoreCase(value))
                .or(emptyIfNull(view.phoneCompany).containsIgnoreCase(value));
    }

    @Query(value = "SELECT emp.id AS assistantId, \n" +
            "CONCAT(pdata.first_name, ' ', pdata.last_name) AS assistantName, COUNT(*) AS amount, COUNT(IF(status = 1, 1, null)) AS apply, \n" +
            "COUNT(IF(status = 2, 1, null)) AS reject, COUNT(IF(status = 0, 1, null)) AS await \n" +
            "FROM crm_social_network_answer AS answer \n" +
            "LEFT JOIN crm_employee AS emp \n" +
            "ON answer.assistant_id = emp.id \n" +
            "LEFT JOIN crm_private_data AS pdata \n" +
            "ON emp.id = pdata.id \n" +
            "WHERE answer.create_date BETWEEN CAST(:creationFrom AS DATETIME) AND CAST(:creationTo AS DATETIME) \n" +
            "GROUP BY assistantId \n" +
            "UNION ALL \n" +
            "SELECT r_emp.id AS assistantId, \n" +
            "CONCAT(r_pdata.first_name, ' ', r_pdata.last_name) AS assistantName, 0, 0, 0, 0 FROM crm_employee r_emp \n" +
            "LEFT JOIN crm_employee_role r_er \n" +
            "ON r_emp.id = r_er.employee_id \n" +
            "LEFT JOIN crm_private_data r_pdata \n" +
            "ON r_emp.id = r_pdata.id \n" +
            "WHERE r_er.role_id = 7 AND r_pdata.is_active = 1 \n" +
            "AND r_emp.id NOT IN \n" +
            "(SELECT assistant_id \n" +
            "FROM crm_social_network_answer \n" +
            "WHERE create_date BETWEEN CAST(:creationFrom AS DATETIME) AND CAST(:creationTo AS DATETIME)) \n" +
            "-- #pageable\n",
            countQuery = "SELECT COUNT(*) FROM  \n" +
                    "(SELECT DISTINCT emp.id AS assistant \n" +
                    "FROM crm_social_network_answer AS answer \n" +
                    "LEFT JOIN crm_employee AS emp \n" +
                    "ON answer.assistant_id = emp.id \n" +
                    "WHERE answer.create_date BETWEEN CAST(:creationFrom AS DATETIME) AND CAST(:creationTo AS DATETIME) \n" +
                    "UNION ALL \n" +
                    "SELECT r_emp.id AS assistant \n" +
                    "FROM crm_employee r_emp \n" +
                    "LEFT JOIN crm_employee_role r_er \n" +
                    "ON r_emp.id = r_er.employee_id \n" +
                    "LEFT JOIN crm_private_data r_pdata \n" +
                    "ON r_emp.id = r_pdata.id \n" +
                    "WHERE r_er.role_id = 7 AND r_pdata.is_active = 1 \n" +
                    "AND r_emp.id NOT IN \n" +
                    "(SELECT assistant_id \n" +
                    "FROM crm_social_network_answer \n" +
                    "WHERE create_date BETWEEN CAST(:creationFrom AS DATETIME) AND CAST(:creationTo AS DATETIME))) tmp;",
            nativeQuery = true)
    Page<RatingNCResponse> getReportsNC (
            @Param("creationFrom") Date creationFrom,
            @Param("creationTo") Date creationTo,
            Pageable pageable
    );

}
