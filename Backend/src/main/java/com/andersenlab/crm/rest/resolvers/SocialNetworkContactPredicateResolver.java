package com.andersenlab.crm.rest.resolvers;

import com.andersenlab.crm.model.entities.QEmployee;
import com.andersenlab.crm.model.entities.QSocialNetworkContact;
import com.andersenlab.crm.model.view.QSocialNetworkAnswerSalesHeadView;
import com.andersenlab.crm.utils.WebRequestHelper;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.JPAExpressions;
import org.springframework.web.context.request.NativeWebRequest;

import java.util.Spliterators;
import java.util.stream.StreamSupport;

import static com.andersenlab.crm.utils.ConverterHelper.getNullable;

public class SocialNetworkContactPredicateResolver implements PredicateResolver {

    private static final QSocialNetworkContact CONTACT = QSocialNetworkContact.socialNetworkContact;

    @Override
    public Predicate resolvePredicate(NativeWebRequest webRequest) {
        Long id = WebRequestHelper.extractLongParameter(webRequest, "id");
        String searchQuery = WebRequestHelper.extractStringParameter(webRequest, "searchQuery");
        String socialNetworkUserName = WebRequestHelper.extractStringParameter(webRequest, "socialNetworkUser.name");

        Long salesAssistantId = WebRequestHelper.extractLongParameter(webRequest, "salesAssistant.id");
        String salesAssistantLogin = WebRequestHelper.extractStringParameter(webRequest, "salesAssistant.login");
        Long salesId = WebRequestHelper.extractLongParameter(webRequest, "sales.id");
        String salesLogin = WebRequestHelper.extractStringParameter(webRequest, "sales.login");

        boolean isSocialAnswer = StreamSupport
                .stream(Spliterators.spliteratorUnknownSize(webRequest.getParameterNames(), 0), false)
                .anyMatch(name1 -> name1.contains("socialAnswer"));

        QSocialNetworkAnswerSalesHeadView view = QSocialNetworkAnswerSalesHeadView.socialNetworkAnswerSalesHeadView;
        BooleanExpression answerPredicate = JPAExpressions
                .selectOne()
                .from(view)
                .where(view.socialNetworkContact.id.eq(CONTACT.id).and(buildSocialAnswerPredicate(webRequest)))
                .exists();

        return new BooleanBuilder()
                .and(withId(id))
                .and(withSocialNetworkUserName(socialNetworkUserName))
                .and(withSearchQuery(searchQuery))
                .and(withEmployee(CONTACT.sales, salesId, salesLogin))
                .and(withEmployee(CONTACT.salesAssistant, salesAssistantId, salesAssistantLogin))
                .and(isSocialAnswer ? answerPredicate : null);

    }

    private Predicate withEmployee(QEmployee employee, Long id, String login) {
        return new BooleanBuilder()
                .and(getNullable(id, employee.id::eq))
                .and(getNullable(login, employee.login::eq));
    }

    private Predicate withId(Long id) {
        return getNullable(id, CONTACT.id::eq);
    }

    private Predicate withSocialNetworkUserName(String name) {
        return getNullable(name, CONTACT.socialNetworkUser.name::containsIgnoreCase);
    }

    private Predicate withSearchQuery(String query) {
        if (query != null) {
            return CONTACT.sales.firstName.concat(" ").concat(CONTACT.sales.lastName).containsIgnoreCase(query)
                    .or(CONTACT.salesAssistant.firstName.concat(" ").concat(CONTACT.salesAssistant.lastName).containsIgnoreCase(query))
                    .or(CONTACT.source.name.containsIgnoreCase(query))
                    .or(CONTACT.socialNetworkUser.name.containsIgnoreCase(query));
        }
        return null;
    }
}
