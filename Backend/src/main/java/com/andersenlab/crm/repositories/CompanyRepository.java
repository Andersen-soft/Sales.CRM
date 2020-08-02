package com.andersenlab.crm.repositories;

import com.andersenlab.crm.model.entities.Company;
import com.andersenlab.crm.model.entities.Contact;
import com.andersenlab.crm.model.entities.QCompany;
import com.andersenlab.crm.model.entities.QCompanySale;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.dsl.StringExpression;
import com.querydsl.jpa.JPAExpressions;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.querydsl.binding.QuerydslBindings;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Iterator;
import java.util.List;

public interface CompanyRepository extends BaseRepository<QCompany, Company, Long> {

    @Override
    default void customize(QuerydslBindings bindings, QCompany root) {
        bindings.bind(root.companySales.any().createDate).all((path, value) -> {
            Iterator<? extends LocalDateTime> iterator = value.iterator();
            return path.between(iterator.next(), iterator.next());
        });

        bindings.bind(root.name).all((path, values) -> {
            BooleanBuilder predicate = new BooleanBuilder();
            values.stream().map(path::containsIgnoreCase).forEach(predicate::or);
            return predicate;
        });

        bindings.bind(root.companySales.any().excludedStatus).first((path, value) ->
                JPAExpressions.selectOne()
                        .from(QCompanySale.companySale)
                        .where(QCompanySale.companySale.status.eq(value)
                                .and(QCompanySale.companySale.company.eq(root)))
                        .notExists());

        bindings.bind(root.companySales.any().statusChangedDate).all(this::getDatePredicate);

        bindings.bind(root.url).first(StringExpression::containsIgnoreCase);

        bindings.bind(root.phone).first(StringExpression::containsIgnoreCase);

        bindings.bind(root.companySales.any().createDate).all(this::getDatePredicate);

        bindings.bind(root.createDate).all(this::getDatePredicate);
    }

    @Query("select company from Company company where upper(company.name) like upper(:companyName)")
    Company findCompanyByName(@Param("companyName") String name);

    Company findCompanyByOldId(Long oldId);

    Company findByContactsIsContaining(Contact contact);

    @Query(value =
            "select *\n" +
                    "from crm_company company\n" +
                    "WHERE company.is_active = 1 AND LOWER(company.name) LIKE CONCAT('%', LOWER(:companyName), '%')\n" +
                    "GROUP BY company.name\n" +
                    "ORDER BY LOCATE(LOWER(:companyName), LOWER(company.name)), LENGTH(company.name), LOWER(company.name)\n" +
                    "-- #pageable\n",
            countQuery = "select count(distinct company.name)\n" +
                    "from crm_company company\n" +
                    "WHERE company.is_active = 1 AND LOWER(company.name) LIKE CONCAT('%', LOWER(:companyName), '%')\n",
            nativeQuery = true)
    Page<Company> getCompaniesSortedByNameAndPageable(@Param("companyName") String name, Pageable pageable);

    @Query(value =
            "SELECT c FROM Company c LEFT JOIN c.industries i\n" +
                    "WHERE c.isActive = true\n" +
                    "AND (:companyName is null OR LOWER(c.name) LIKE CONCAT('%', LOWER(:companyName), '%'))\n" +
                    "AND (:url is null OR LOWER(c.url) LIKE CONCAT('%', LOWER(:url), '%'))\n" +
                    "AND (:phone is null OR LOWER(c.phone) LIKE CONCAT('%', LOWER(:phone), '%'))\n" +
                    "AND (:responsibleId is null OR c.responsible.id = :responsibleId)\n" +
                    "AND (COALESCE(:industries, null) is null OR i.id IN (:industries)OR (-1 IN (:industries) AND  i IS NULL))\n" +
                    "GROUP BY c.name\n" +
                    "ORDER BY" +
                    " LOCATE(CASE WHEN :companyName IS NOT NULL THEN LOWER(:companyName) ELSE '' END, LOWER(c.name)),\n" +
                    " LOWER(c.name), LENGTH(c.name)"
    )
    Page<Company> getCompaniesForGlobalSearch(
            @Param("companyName") String name,
            @Param("url") String url,
            @Param("phone") String phone,
            @Param("responsibleId") Long id,
            @Param("industries") List<Long> industries,
            Pageable pageable
    );

    @Query("select count(*) > 0 from Company c where upper(c.name) like upper(:companyName) and c.id <> :companyId")
    boolean existsByNameAndIdNot(@Param("companyName")String name, @Param("companyId") Long id);

    @Query("select count(*) > 0 from Company company where upper(company.name) like upper(:companyName)")
    boolean existsByName(@Param("companyName") String name);
}
