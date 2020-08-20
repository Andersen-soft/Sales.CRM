package com.andersenlab.crm.rest.resolvers;

import com.andersenlab.crm.model.RoleEnum;
import com.andersenlab.crm.model.entities.EstimationRequest;
import com.andersenlab.crm.model.entities.QEmployee;
import com.andersenlab.crm.model.entities.QEstimationRequest;
import com.andersenlab.crm.model.view.QSaleReport;
import com.andersenlab.crm.model.view.QSocialNetworkAnswerSalesHeadView;
import com.andersenlab.crm.utils.ServiceUtils;
import com.andersenlab.crm.utils.WebRequestHelper;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.NumberPath;
import com.querydsl.jpa.JPAExpressions;
import org.springframework.web.context.request.NativeWebRequest;

import java.util.List;
import java.util.Spliterators;
import java.util.stream.StreamSupport;

import static com.andersenlab.crm.utils.ConverterHelper.getNullable;
import static com.andersenlab.crm.utils.PredicateHelper.emptyIfNull;

public class EmployeePredicateResolver implements PredicateResolver {

    private static final QEmployee EMPLOYEE = QEmployee.employee;

    @Override
    public Predicate resolvePredicate(NativeWebRequest webRequest) {

        Long id = WebRequestHelper.extractLongParameter(webRequest, "id");
        Boolean isActive = WebRequestHelper.extractBooleanParameter(webRequest, "isActive");
        Boolean responsibleRM = WebRequestHelper.extractBooleanParameter(webRequest, "responsibleRM");
        String name = WebRequestHelper.extractStringParameter(webRequest, "name");
        String employeeLang = WebRequestHelper.extractStringParameter(webRequest, "employeeLang");
        String email = WebRequestHelper.extractStringParameter(webRequest, "email");
        String skype = WebRequestHelper.extractStringParameter(webRequest, "skype");
        String position = WebRequestHelper.extractStringParameter(webRequest, "position");
        String login = WebRequestHelper.extractStringParameter(webRequest, "login");
        List<Long> roles = WebRequestHelper.extractMappedParameterList(webRequest, "role", Long::valueOf);
        String telegramUsername = WebRequestHelper.extractStringParameter(webRequest, "telegramUsername");

        boolean isSocialAnswer = StreamSupport
                .stream(Spliterators.spliteratorUnknownSize(webRequest.getParameterNames(), 0), false)
                .anyMatch(name1 -> name1.contains("socialAnswer"));
        QSocialNetworkAnswerSalesHeadView view = QSocialNetworkAnswerSalesHeadView.socialNetworkAnswerSalesHeadView;
        BooleanExpression answerPredicate = null;
        if (isSocialAnswer) {
            BooleanExpression one = null;
            if (roles.contains(((long) RoleEnum.ROLE_SALES.ordinal() + 1))) {
                one = view.responsible.id.eq(EMPLOYEE.id);
            } else if (roles.contains(((long) RoleEnum.ROLE_NETWORK_COORDINATOR.ordinal() + 1))) {
                one = view.assistant.id.eq(EMPLOYEE.id);
            }
            if (one != null) {
                answerPredicate = JPAExpressions
                        .selectOne()
                        .from(view)
                        .where(one.and(buildSocialAnswerPredicate(webRequest)))
                        .exists();
            }
        }
      
        return new BooleanBuilder()
                .and(withId(id))
                .and(isResponsibleRm(responsibleRM))
                .and(isActive(isActive))
                .and(withEstimationRequest(webRequest))
                .and(withName(name))
                .and(withEmail(email))
                .and(withSkype(skype))
                .and(withPosition(position))
                .and(withLogin(login))
                .and(withRoles(roles))
                .and(withEmployeeLang(employeeLang))
                .and(answerPredicate)
                .and(withSaleReport(webRequest))
                .and(withTelegramUsername(telegramUsername));
    }

    private Predicate withSaleReport(NativeWebRequest webRequest) {
        QSaleReport saleReport = QSaleReport.saleReport;

        Boolean isSaleReport = WebRequestHelper.extractBooleanParameter(
                webRequest,
                "saleReport.isSaleReportFilter");

        BooleanBuilder predicate = new BooleanBuilder();

        if (isSaleReport != null && isSaleReport) {
            predicate = buildSaleReportPredicate(webRequest).and(saleReport.responsibleId.eq(EMPLOYEE.id));
        }

        return JPAExpressions
                .selectOne()
                .from(saleReport)
                .where(predicate)
                .exists();
    }

    private static Predicate withEstimationRequest(NativeWebRequest webRequest) {
        Boolean isCreators = WebRequestHelper.extractBooleanParameter(
                webRequest,
                "estimationRequest.isCreators");
        String name = WebRequestHelper.extractStringParameter(
                webRequest,
                "estimationRequest.name");
        Long companyId = WebRequestHelper.extractLongParameter(
                webRequest,
                "estimationRequest.companyId");
        Long responsibleId = WebRequestHelper.extractLongParameter(
                webRequest,
                "estimationRequest.responsibleId");
        Long creatorId = WebRequestHelper.extractLongParameter(
                webRequest,
                "estimationRequest.creatorId");
        QEstimationRequest estimationRequest = QEstimationRequest.estimationRequest;
        List<EstimationRequest.Status> statuses = WebRequestHelper.extractMappedParameterList(
                webRequest,
                "estimationRequest.status",
                value -> ServiceUtils.getByNameOrThrow(EstimationRequest.Status.class, value));

        BooleanExpression statusesExpression
                = statuses != null && !statuses.isEmpty() ? estimationRequest.status.in(statuses) : null;
        NumberPath<Long> employeeId = null;
        if (isCreators != null) {
            employeeId = Boolean.TRUE.equals(isCreators) ? estimationRequest.author.id : estimationRequest.responsibleForRequest.id;
        }


        BooleanBuilder predicate = new BooleanBuilder()
                .and(getNullable(name, estimationRequest.id.stringValue().concat(" - ").concat(estimationRequest.name)::containsIgnoreCase))
                .and(getNullable(companyId, estimationRequest.company.id::eq))
                .and(getNullable(responsibleId, estimationRequest.responsibleForRequest.id::eq))
                .and(getNullable(creatorId, estimationRequest.author.id::eq))
                .and(statusesExpression);

        return JPAExpressions
                .selectOne()
                .from(estimationRequest)
                .where(predicate.and(employeeId == null ? null : QEmployee.employee.id.eq(employeeId)))
                .exists();
    }

    private Predicate isActive(Boolean isActive) {
        return getNullable(isActive, EMPLOYEE.isActive::eq);
    }

    private Predicate isResponsibleRm(Boolean responsibleRm) {
        return getNullable(responsibleRm, EMPLOYEE.responsibleRM::eq);
    }

    private Predicate withId(Long id) {
        return getNullable(id, EMPLOYEE.id::eq);
    }

    private Predicate withRoles(List<Long> roleIds) {
        return roleIds != null && !roleIds.isEmpty() ? EMPLOYEE.roles.any().id.in(roleIds) : null;
    }

    private Predicate withEmail(String email){
        return getNullable(email, EMPLOYEE.email::containsIgnoreCase);
    }

    private Predicate withSkype(String skype){
        return getNullable(skype, EMPLOYEE.skype::containsIgnoreCase);
    }

    private Predicate withPosition(String position){
        return getNullable(position, EMPLOYEE.position::containsIgnoreCase);
    }

    private Predicate withLogin(String login){
        return getNullable(login, EMPLOYEE.login::containsIgnoreCase);
    }

    private Predicate withName(String name) {
        return getNullable(name, requestName -> emptyIfNull(EMPLOYEE.firstName)
                .concat(" ")
                .concat(emptyIfNull(EMPLOYEE.lastName)).containsIgnoreCase(requestName));
    }

    private Predicate withEmployeeLang(String employeeLang) {
        return getNullable(employeeLang, EMPLOYEE.employeeLang::equalsIgnoreCase);
    }

    private Predicate withTelegramUsername(String telegramUsername) {
        return getNullable(telegramUsername, EMPLOYEE.telegramUsername::containsIgnoreCase);
    }
}
