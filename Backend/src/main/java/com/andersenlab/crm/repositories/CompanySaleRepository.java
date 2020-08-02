package com.andersenlab.crm.repositories;

import com.andersenlab.crm.model.entities.Company;
import com.andersenlab.crm.model.entities.CompanySale;
import com.andersenlab.crm.model.entities.Contact;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.model.entities.QActivity;
import com.andersenlab.crm.model.entities.QCompanySale;
import com.andersenlab.crm.repositories.view.SourceStatisticView;
import com.querydsl.core.types.Predicate;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.SimpleExpression;
import com.querydsl.jpa.JPAExpressions;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.querydsl.binding.QuerydslBindings;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

import static com.andersenlab.crm.model.entities.SqlConstants.SOURCES_STATISTIC_QUERY;

public interface CompanySaleRepository extends BaseRepository<QCompanySale, CompanySale, Long> {

    @Override
    default void customize(QuerydslBindings bindings, QCompanySale root) {
        bindString(bindings, root);

        bindings.bind(root.weight).first(SimpleExpression::eq);

        bindings.bind(root.createDate).all(this::getDatePredicate);

        bindings.bind(root.createLeadDate).all(this::getDatePredicate);

        bindings.bind(root.excludedStatus).first((path, value) -> root.status.ne(value));

        bindings.bind(root.statusChangedDate).all(this::getDatePredicate);

        bindings.bind(root.lastActivity.dateActivity).all(this::getDatePredicate);

        bindings.bind(root.nextActivityDate).all(this::getDatePredicate);

        bindings.bind(root.search).first((path, value) -> defineSearchPredicate(value));

        bindings.bind(root.isPastActivity).first((path, value) -> {
            if (value) {
                return root.nextActivityDate.before(LocalDateTime.now());
            }
            return root.nextActivityDate.after(LocalDateTime.now());
        });

        bindings.bind(root.status).all(SimpleExpression::in);
    }

    static Predicate defineSearchPredicate(String value) {
        QCompanySale sale = QCompanySale.companySale;
        QActivity activity = sale.lastActivity;
        BooleanExpression lastActivityExpression = JPAExpressions
                .selectOne()
                .from(activity)
                .where(activity.description.containsIgnoreCase(value))
                .exists();
        return sale.id.stringValue().containsIgnoreCase(value)
                .or(sale.companyName.containsIgnoreCase(value))
                .or(sale.mainContactName.containsIgnoreCase(value))
                .or(sale.mainContactEmail.containsIgnoreCase(value))
                .or(sale.mainContactSkype.containsIgnoreCase(value))
                .or(sale.socialContact.containsIgnoreCase(value))
                .or(sale.estimationNames.containsIgnoreCase(value))
                .or(sale.resumeNames.containsIgnoreCase(value))
                .or(lastActivityExpression)
                .or(sale.description.containsIgnoreCase(value));
    }

    @Query("SELECT cs.status as status, count(cs.status) as count " +
            "from CompanySale cs " +
            "where cs.responsible = :responsible " +
            "and cs.isActive = 1" +
            "group by cs.status")
    List<Object[]> getSalesCountByStatusesOfCurrentUser(@Param("responsible") Employee responsible);

    @Query(SOURCES_STATISTIC_QUERY +
            "and cs.responsible = :responsible " +
            "and cs.isActive = 1 " +
            "group by s.name " +
            "order by s.type, s.name"
    )
    List<SourceStatisticView> getSalesSourcesStatistic(
            @Param("creationFrom") LocalDateTime creationFrom,
            @Param("creationTo") LocalDateTime creationTo,
            @Param("responsible") Employee responsible
    );

    @Query(SOURCES_STATISTIC_QUERY +
            "and cs.isActive = 1 " +
            "group by s.name " +
            "order by s.type, s.name"
    )
    List<SourceStatisticView> getSalesSourcesStatistic(
            @Param("creationFrom") LocalDateTime creationFrom,
            @Param("creationTo") LocalDateTime creationTo
    );

    @Query("SELECT count(cs) " +
            "from CompanySale cs " +
            "LEFT OUTER JOIN cs.company c " +
            "LEFT OUTER JOIN cs.mainContact m " +
            "where cs.responsible = :responsible " +
            "and cs.nextActivityDate < sysdate() " +
            "and cs.status != 5 " +
            "and cs.isActive = 1"
    )
    Long getPastCompanySalesCount(
            @Param("responsible") Employee responsible
    );

    CompanySale findByIsActiveIsTrueAndId(Long id);

    //Вырезать на корню из проекта!!!
    CompanySale findCompanySaleByOldId(Long oldId);

    @Query("SELECT cs FROM CompanySale cs WHERE cs.isActive = true " +
            "AND cs.createDate BETWEEN :from AND :to " +
            "AND (LOWER(:email) = ANY(SELECT c.email FROM Contact c WHERE c.company = cs.company) " +
            "OR LOWER(:phone) = ANY(SELECT c.phone FROM Contact c WHERE c.company = cs.company))")
    List<CompanySale> findByContactEmailOrPhone(
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to,
            @Param("email") String email,
            @Param("phone") String phone);

    boolean existsCompanySalesByMainContactAndCompany(Contact contact, Company company);
}
