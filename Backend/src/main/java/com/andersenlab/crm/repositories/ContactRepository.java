package com.andersenlab.crm.repositories;

import com.andersenlab.crm.model.entities.Contact;
import com.andersenlab.crm.model.entities.QContact;
import com.querydsl.core.types.Predicate;
import com.querydsl.core.types.dsl.DatePath;
import org.springframework.data.querydsl.binding.QuerydslBindings;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import static com.andersenlab.crm.utils.PredicateHelper.emptyIfNull;

public interface ContactRepository extends BaseRepository<QContact, Contact, Long> {

    @Override
    default void customize(QuerydslBindings bindings, QContact root) {
        bindStringAndLong(bindings, root);

        bindings.bind(root.fio).first((path, value) ->
                emptyIfNull(root.firstName)
                        .concat(" ")
                        .concat(emptyIfNull(root.lastName))
                        .containsIgnoreCase(value));

        bindings.bind(root.emails).first((path, value) ->
                emptyIfNull(root.email).containsIgnoreCase(value)
                        .or(emptyIfNull(root.personalEmail).containsIgnoreCase(value)));
        bindings.bind(root.dateOfBirth).all(this::getMonthAndDatePredicate);
    }

    default Predicate getMonthAndDatePredicate(DatePath path, Collection values) {
        if (values.isEmpty()) {
            return null;
        }
        List<? extends LocalDate> dates = new ArrayList<>(values);
        LocalDateTime minDate = dates.get(0).atStartOfDay().minusHours(3);
        LocalDateTime maxDate = minDate;
        if (dates.size() > 1) {
            maxDate = dates.get(1).atStartOfDay().minusHours(3);
        }
        int startMonth = minDate.getMonthValue();
        int startDay = minDate.getDayOfMonth();
        int endMonth = maxDate.getMonthValue();
        int endDay = maxDate.getDayOfMonth();

        if (startMonth == endMonth && startDay <= endDay) {
            return path.isNotNull().and(path.month().eq(startMonth))
                    .and(path.dayOfMonth().between(startDay,endDay));
        }

        if (startMonth * 100 + startDay > endMonth * 100 + endDay) {
            return path.isNotNull().and(path.month().gt(startMonth).and(path.month().lt(12))
                    .or(path.month().eq(startMonth).and(path.dayOfMonth().goe(startDay)))
                    .or(path.month().eq(12).and(path.dayOfMonth().loe(31)))
                    .or(path.month().gt(1).and(path.month().lt(endMonth)))
                    .or(path.month().eq(1).and(path.dayOfMonth().goe(1)))
                    .or(path.month().eq(endMonth).and(path.dayOfMonth().loe(endDay))));
        } else {
            return path.isNotNull().and(path.month().gt(startMonth).and(path.month().lt(endMonth))
                    .or(path.month().eq(startMonth).and(path.dayOfMonth().goe(startDay)))
                    .or(path.month().eq(endMonth).and(path.dayOfMonth().loe(endDay))));
        }
    }

    Contact findContactByOldId(Long oldId);

    List<Contact> findAllByCompanyId(Long id);

    Contact findByCompanyId(Long id);
}
