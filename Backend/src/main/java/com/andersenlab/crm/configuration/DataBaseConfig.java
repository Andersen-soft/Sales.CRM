package com.andersenlab.crm.configuration;

import com.andersenlab.crm.Application;
import com.andersenlab.crm.dsl.impl.CustomQueryDslJpaRepositoryImpl;
import com.mchange.v2.c3p0.ComboPooledDataSource;
import net.ttddyy.dsproxy.listener.logging.SLF4JLogLevel;
import net.ttddyy.dsproxy.support.ProxyDataSourceBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.convert.threeten.Jsr310JpaConverters;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.beans.PropertyVetoException;

@Configuration
@Component
@EntityScan(
        basePackageClasses = {Application.class, Jsr310JpaConverters.class}
)
@EnableJpaRepositories(basePackages = {"com.andersenlab.crm.repositories"}, repositoryBaseClass = CustomQueryDslJpaRepositoryImpl.class)
public class DataBaseConfig {

    @Value("${db.url}")
    private String url;

    @Value("${db.username}")
    private String userName;

    @Value("${db.password}")
    private String pass;

    @Value("${db.driverclassname}")
    private String driverClassName;

    @Bean
    public DataSource getDataSource() throws PropertyVetoException {
        ComboPooledDataSource dataSource = new ComboPooledDataSource();
        dataSource.setDriverClass(driverClassName);
        dataSource.setJdbcUrl(url);
        dataSource.setUser(userName);
        dataSource.setPassword(pass);
        dataSource.setMaxIdleTime(28800);
        dataSource.setIdleConnectionTestPeriod(25200);
        dataSource.setMinPoolSize(5);
        dataSource.setMaxPoolSize(20);
        dataSource.setMaxStatements(150);

        /*
         * Оборачиваем датасорс в прокси для более читаемого лога, логи отображабтся если в настройках приложения указан
         * уровень логов debug.
         * */
        return ProxyDataSourceBuilder
                .create(dataSource)
                .logQueryBySlf4j(SLF4JLogLevel.DEBUG)
                .multiline()
                .build();
    }
}
