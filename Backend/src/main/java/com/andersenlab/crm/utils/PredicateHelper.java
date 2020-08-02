package com.andersenlab.crm.utils;

import com.querydsl.core.types.dsl.StringExpression;

public class PredicateHelper {

    private PredicateHelper(){

    }

    public static StringExpression emptyIfNull(StringExpression expression) {
        return expression.coalesce("").asString();
    }
}
