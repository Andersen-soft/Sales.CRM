package com.andersenlab.crm.configuration;

import com.andersenlab.crm.interceptors.FavoritesInterceptor;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.JpaProperties;
import org.springframework.boot.autoconfigure.transaction.TransactionManagerCustomizers;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.jta.JtaTransactionManager;

import javax.sql.DataSource;
import java.util.Map;

@Configuration
public class HibernateConfiguration extends HibernateJpaAutoConfiguration {

    private final FavoritesInterceptor favoritesInterceptor;

    @Autowired
    @SuppressWarnings("all")
    public HibernateConfiguration(DataSource dataSource,
                                  JpaProperties jpaProperties,
                                  ObjectProvider<JtaTransactionManager> jtaTransactionManager,
                                  ObjectProvider<TransactionManagerCustomizers> transactionManagerCustomizers,
                                  FavoritesInterceptor favoritesInterceptor) {
        super(dataSource, jpaProperties, jtaTransactionManager, transactionManagerCustomizers);
        this.favoritesInterceptor = favoritesInterceptor;
    }

    @Override
    protected void customizeVendorProperties(Map<String, Object> vendorProperties) {
        vendorProperties.put("hibernate.session_factory.interceptor", favoritesInterceptor);
    }
}
