package com.andersenlab.crm.repositories;

import com.andersenlab.crm.model.entities.CompanySale;
import com.andersenlab.crm.model.entities.SaleRequestType;
import com.andersenlab.crm.model.view.QSaleReport;
import com.andersenlab.crm.model.view.SaleReport;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.StringTemplate;
import org.springframework.data.querydsl.binding.QuerydslBindings;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static com.andersenlab.crm.model.entities.SqlConstants.CONVERT_TO_CHAR;
import static com.andersenlab.crm.utils.ServiceUtils.filterEnumByStringInBundleValues;

public interface ReportRepository extends BaseRepository<QSaleReport, SaleReport, Long> {

    @Override
    default void customize(QuerydslBindings bindings, QSaleReport root) {
        bindString(bindings, root);

        bindings.bind(root.statusChangedDate).all(this::getDatePredicate);

        bindings.bind(root.statusDate).all((path, value) -> {
            List<? extends LocalDate> dates = new ArrayList<>(value);
            BooleanBuilder predicate = new BooleanBuilder();
            dates.forEach(d -> predicate.or(path.between(d, d.plusDays(1))));
            return predicate;
        });

        bindings.bind(root.createDate).all(this::getDatePredicate);

        bindings.bind(root.createLeadDate).all(this::getDatePredicate);

        bindings.bind(root.search).first((stringSimplePath, s) -> defineSearchPredicate(s));

        bindings.bind(root.excludedStatus).all((path, value) -> root.status.notIn(value));

        bindings.bind(root.lastActivityDate).all(this::getDatePredicate);

        bindings.bind(root.email).all(this::getNullOrNotNullPredicate);

        bindings.bind(root.personalEmail).all(this::getNullOrNotNullPredicate);

        bindings.bind(root.skype).all(this::getNullOrNotNullPredicate);

        bindings.bind(root.phone).all(this::getNullOrNotNullPredicate);

        bindings.bind(root.weight).all((path, values) -> {
            StringTemplate template = Expressions.stringTemplate(CONVERT_TO_CHAR, path);
            return values.stream()
                    .map(Object::toString)
                    .map(template::eq)
                    .collect(BooleanBuilder::new, BooleanBuilder::or, BooleanBuilder::or);
        });
    }

    static Predicate defineSearchPredicate(String value) {
        List<CompanySale.Status> statuses = filterEnumByStringInBundleValues(value, CompanySale.Status.class);
        List<String> stringCategories = filterEnumByStringInBundleValues(value, CompanySale.Category.class)
                .stream()
                .map(Enum::name)
                .collect(Collectors.toList());
        List<SaleRequestType> types = filterEnumByStringInBundleValues(value, SaleRequestType.class);
        QSaleReport report = QSaleReport.saleReport;
        return report.sourceName.containsIgnoreCase(value)
                .or(report.companyName.containsIgnoreCase(value))
                .or(report.companyUrl.containsIgnoreCase(value))
                .or(report.companyRecommendationId.stringValue().containsIgnoreCase(value))
                .or(report.companyRecommendationName.containsIgnoreCase(value))
                .or(report.mainContact.containsIgnoreCase(value))
                .or(report.contactPosition.containsIgnoreCase(value))
                .or(report.email.containsIgnoreCase(value))
                .or(report.skype.containsIgnoreCase(value))
                .or(report.socialNetwork.containsIgnoreCase(value))
                .or(report.socialContactName.containsIgnoreCase(value))
                .or(report.phone.containsIgnoreCase(value))
                .or(report.personalEmail.containsIgnoreCase(value))
                .or(report.countryName.containsIgnoreCase(value))
                .or(report.responsibleId.stringValue().containsIgnoreCase(value))
                .or(report.responsibleName.containsIgnoreCase(value))
                .or(report.companyResponsibleRmId.stringValue().containsIgnoreCase(value))
                .or(report.companyResponsibleRmName.containsIgnoreCase(value))
                .or(report.id.stringValue().containsIgnoreCase(value))
                .or(report.resumeRequests.stringValue().containsIgnoreCase(value))
                .or(report.estimationRequests.stringValue().containsIgnoreCase(value))
                .or(report.status.in(statuses))
                .or(report.category.in(stringCategories))
                .or(report.type.in(types))
                .or(report.companyIndustries.stringValue().containsIgnoreCase(value));
    }
}