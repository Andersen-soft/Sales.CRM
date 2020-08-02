package com.andersenlab.crm.rest.resolvers;

import static com.andersenlab.crm.utils.ConverterHelper.getNullable;
import static com.andersenlab.crm.utils.PredicateHelper.emptyIfNull;
import static com.andersenlab.crm.utils.ServiceUtils.getByNameOrThrow;
import static com.andersenlab.crm.utils.WebRequestHelper.extractBooleanParameter;
import static com.andersenlab.crm.utils.WebRequestHelper.extractLongParameter;
import static com.andersenlab.crm.utils.WebRequestHelper.extractLongParameterList;
import static com.andersenlab.crm.utils.WebRequestHelper.extractMappedParameterList;
import static com.andersenlab.crm.utils.WebRequestHelper.extractStringParameter;

import com.andersenlab.crm.model.entities.QResume;
import com.andersenlab.crm.model.entities.Resume;
import com.andersenlab.crm.model.entities.ResumeRequest;
import com.andersenlab.crm.model.view.QAllResumeRequestsView;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;
import com.querydsl.jpa.JPAExpressions;
import org.springframework.web.context.request.NativeWebRequest;

import java.util.List;

public class AllResumeRequestViewPredicateResolver implements PredicateResolver {
    private static final QAllResumeRequestsView VIEW = QAllResumeRequestsView.allResumeRequestsView;


    @Override
    public Predicate resolvePredicate(NativeWebRequest webRequest) {

        /*
         *Получаем параметры из запроса.
         * */
        Boolean isActive = extractBooleanParameter(webRequest, "isActive");
        Long companyId = extractLongParameter(webRequest, "companyId");
        Long responsibleId = extractLongParameter(webRequest, "responsibleId");
        Long responsibleForSaleRequestId = extractLongParameter(webRequest, "responsibleForSaleRequestId");
        String name = extractStringParameter(webRequest, "name");
        List<ResumeRequest.Status> statuses = extractMappedParameterList(webRequest, "status",
                value -> getByNameOrThrow(ResumeRequest.Status.class, value));
        List<Resume.Status> resumeStatuses = extractMappedParameterList(webRequest, "resumes.status",
                value -> getByNameOrThrow(Resume.Status.class, value));
        List<Long> responsibleHrs = extractLongParameterList(webRequest, "resumes.responsibleHr.id");

        /*
         * Собираем параметры в кучу и создаем предикат.
         * */
        return new BooleanBuilder()
                .and(isActive(isActive))
                .and(withCompany(companyId))
                .and(withName(name))
                .and(withResponsibleRm(responsibleId))
                .and(withStatuses(statuses))
                .and(withResponsibleForSale(responsibleForSaleRequestId))
                .and(withResume(responsibleHrs, resumeStatuses));
    }

    private Predicate isActive(Boolean isActive) {
        //in case: isActive is null (FE mistake) default true
        return isActive == null ? VIEW.isActive.eq(true) : VIEW.isActive.eq(isActive);
    }

    private Predicate withCompany(Long companyId) {
        return getNullable(companyId, VIEW.companyId::eq);
    }

    private Predicate withName(String name) {
        return getNullable(name, requestName -> VIEW.resumeRequestId.stringValue()
                .concat(" - ")
                .concat(emptyIfNull(VIEW.name)).containsIgnoreCase(requestName));
    }

    private Predicate withResponsibleRm(Long responsibleRmId) {
        return getNullable(responsibleRmId, VIEW.responsibleId::eq);
    }

    private Predicate withResponsibleForSale(Long creatorId) {
        return getNullable(creatorId, VIEW.responsibleForSaleRequestId::eq);
    }

    private Predicate withStatuses(List<ResumeRequest.Status> statuses) {
        if (!statuses.isEmpty()) {
            return VIEW.status.in(statuses);
        }

        return null;
    }

    private Predicate withResume(List<Long> responsibleHrs, List<Resume.Status> statuses) {
        if (!responsibleHrs.isEmpty() || !statuses.isEmpty()) {
            BooleanBuilder predicate = new BooleanBuilder();
            if (!responsibleHrs.isEmpty()) {
                predicate = predicate.and(QResume.resume.responsibleHr.id.in(responsibleHrs));
            }

            if (!statuses.isEmpty()) {
                predicate = predicate.and(QResume.resume.status.in(statuses));
            }

            predicate = predicate.and(QResume.resume.resumeRequest.id
                    .eq(QAllResumeRequestsView.allResumeRequestsView.resumeRequestId))
                    .and(QResume.resume.isActive.eq(true));
            return JPAExpressions.selectOne().from(QResume.resume)
                    .where(predicate)
                    .exists();
        }

        return null;
    }
}
