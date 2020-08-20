package com.andersenlab.crm.rest.resolvers;

import com.andersenlab.crm.model.entities.QEstimationRequest;
import com.andersenlab.crm.utils.WebRequestHelper;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;
import org.springframework.web.context.request.NativeWebRequest;

import static com.andersenlab.crm.utils.ConverterHelper.getNullable;

public class EstimationRequestPredicateResolver implements PredicateResolver {

    private static final QEstimationRequest REQUEST = QEstimationRequest.estimationRequest;

    @Override
    public Predicate resolvePredicate(NativeWebRequest webRequest) {

        Long companyId = WebRequestHelper.extractLongParameter(webRequest, "company");
        Boolean isActive = WebRequestHelper.extractBooleanParameter(webRequest, "isActive");
        return new BooleanBuilder()
                .and(isActive(isActive))
                .and(withCompanyId(companyId));
    }

    private Predicate isActive(Boolean isActive) {
        return isActive == null ? REQUEST.isActive.eq(true) : REQUEST.isActive.eq(isActive);
    }

    private Predicate withCompanyId(Long companyId) {
        return getNullable(companyId, REQUEST.company.id::eq);
    }
}
