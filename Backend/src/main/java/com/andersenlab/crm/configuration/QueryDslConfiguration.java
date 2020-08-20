package com.andersenlab.crm.configuration;

import com.andersenlab.crm.rest.resolvers.CrmPredicateMethodArgumentResolver;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.ObjectFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.core.convert.ConversionService;
import org.springframework.data.querydsl.SimpleEntityPathResolver;
import org.springframework.data.querydsl.binding.QuerydslBindingsFactory;
import org.springframework.data.web.config.QuerydslWebConfiguration;
import org.springframework.data.web.querydsl.QuerydslPredicateArgumentResolver;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@Configuration
@Import(QuerydslWebConfiguration.class)
@AllArgsConstructor
public class QueryDslConfiguration extends WebMvcConfigurerAdapter {
    @Qualifier("mvcConversionService")
    private ObjectFactory<ConversionService> conversionService;

    @Bean
    public QuerydslBindingsFactory querydslBindingsFactory() {
        return new QuerydslBindingsFactory(SimpleEntityPathResolver.INSTANCE);
    }

    @Bean
    public QuerydslPredicateArgumentResolver querydslPredicateArgumentResolver() {
        return new CrmPredicateMethodArgumentResolver(querydslBindingsFactory(), conversionService.getObject());
    }
}
