package com.andersenlab.crm.configuration;

import com.andersenlab.crm.configuration.properties.LdapProperties;
import com.andersenlab.crm.configuration.properties.TokenProperties;
import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.model.RoleEnum;
import com.andersenlab.crm.repositories.EmployeeRepository;
import com.andersenlab.crm.security.AuthHandler;
import com.andersenlab.crm.security.CustomUserDetailsService;
import com.andersenlab.crm.security.JWTAuthenticationFilter;
import com.andersenlab.crm.security.JWTAuthorizationFilter;
import com.andersenlab.crm.security.JWTRefreshTokenFilter;
import com.andersenlab.crm.security.JwtLogoutHandler;
import com.andersenlab.crm.security.TokenManager;
import com.andersenlab.crm.security.UnauthorizedErrorAuthenticationEntryPoint;
import com.andersenlab.crm.services.TokenService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.ImmutableList;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.config.MethodInvokingFactoryBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import javax.servlet.Filter;
import java.io.IOException;

@Configuration
@Component
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    private static final String[] AUTH_WHITELIST = {
            // -- swagger ui
            "/v2/api-docs",
            "/swagger-resources",
            "/swagger-resources/**",
            "/configuration/ui",
            "/configuration/security",
            "/swagger-ui.html",
            "/swagger",
            "/webjars/**",
            // other public endpoints of your API may be appended to this array
            "/built/**",
            "/main.css"
    };

    @Value("${app.findAllActiveUserInADFilter}")
    private String filterString;

    @Value("${app.baseDN}")
    private String baseDN;

    @Value("${app.cors.origins}")
    private String corsOrigins;

    private final EmployeeRepository employeeRepository;
    private final CustomUserDetailsService customUserDetailsService;
    private final ConversionService conversionService;
    private final ObjectMapper objectMapper;
    private final TokenService tokenService;
    private final TokenProperties tokenProperties;
    private final LdapProperties ldapProperties;


    @Autowired
    public SecurityConfig(EmployeeRepository employeeRepository,
                          CustomUserDetailsService customUserDetailsService,
                          ConversionService conversionService,
                          ObjectMapper objectMapper,
                          TokenService tokenService,
                          TokenProperties tokenProperties,
                          LdapProperties ldapProperties) {
        this.employeeRepository = employeeRepository;
        this.customUserDetailsService = customUserDetailsService;
        this.conversionService = conversionService;
        this.objectMapper = objectMapper;
        this.tokenService = tokenService;
        this.tokenProperties = tokenProperties;
        this.ldapProperties = ldapProperties;
    }

    @Bean
    public UnauthorizedErrorAuthenticationEntryPoint authenticationEntryPoint() {
        return new UnauthorizedErrorAuthenticationEntryPoint();
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CrmLdapHelper getLdapHelper() throws IOException {
        CrmLdapConnectionRequest connectionRequest = CrmLdapConnectionRequest.builder()
                .url(ldapProperties.getUrl())
                .port(ldapProperties.getPort())
                .login(ldapProperties.getLogin())
                .pass(ldapProperties.getPassword())
                .build();
        return new CrmLdapHelper(connectionRequest, conversionService, filterString, baseDN, ldapProperties.isEnable());
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(customUserDetailsService);
        auth.userDetailsService(customUserDetailsService).passwordEncoder(bCryptPasswordEncoder());
    }

    @Override
    public void configure(WebSecurity web) throws Exception {
        super.configure(web);
        web
                .ignoring()
                .antMatchers(HttpMethod.POST, "/skype/**");
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .authorizeRequests()
                .antMatchers(AUTH_WHITELIST).permitAll()
                .antMatchers("/crm/**").permitAll() // for WS 'GET /crm/info'
                .antMatchers("/admin/check-token").permitAll()
                .antMatchers("/company_sale/express_sale").permitAll()
                .antMatchers("/company_sale/mail_express_sale").permitAll()
                .antMatchers("/employee/get_for_express_sale").permitAll()
                .antMatchers("/country").permitAll()
                .antMatchers("/admin/testAuth").authenticated()
                .antMatchers("/admin/testAdminAuth").hasAuthority(RoleEnum.ROLE_ADMIN.toString())
                .antMatchers("/google-ad-record/export").permitAll()
                .anyRequest().authenticated()
                .and()
                .addFilterAfter(loggingHttpFilter(), JWTAuthorizationFilter.class)
                .addFilterAfter(getRefreshTokenFilter(), JWTAuthorizationFilter.class)
                .addFilter(getAuthenticationFilter())
                .addFilter(getAuthorizationFilter())
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .logout()
                .logoutSuccessHandler(jwtLogoutHandler())
                .and()
                .exceptionHandling()
                .authenticationEntryPoint(authenticationEntryPoint());
        http.cors().configurationSource(corsConfigurationSource())
                .and().csrf().disable();
        http.headers().frameOptions().disable(); //for WS
    }

    private Filter getRefreshTokenFilter() {
        return new JWTRefreshTokenFilter(tokenManager(), objectMapper, tokenProperties);
    }

    @Bean
    public JwtLogoutHandler jwtLogoutHandler() {
        return new JwtLogoutHandler(tokenManager(), objectMapper);
    }

    @Bean
    public MethodInvokingFactoryBean methodInvokingFactoryBean() {
        MethodInvokingFactoryBean methodInvokingFactoryBean = new MethodInvokingFactoryBean();
        methodInvokingFactoryBean.setTargetClass(SecurityContextHolder.class);
        methodInvokingFactoryBean.setTargetMethod("setStrategyName");
        methodInvokingFactoryBean.setArguments(new String[]{SecurityContextHolder.MODE_INHERITABLETHREADLOCAL});
        return methodInvokingFactoryBean;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(ImmutableList.of("*"));
        configuration.setAllowedMethods(ImmutableList.of("HEAD", "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowCredentials(true); //for WS
        configuration.setAllowedHeaders(ImmutableList.of("Authorization", "Content-Type", "Cache-Control", "Refresh", "Origin"));
        configuration.setExposedHeaders(ImmutableList.of("Access-Control-Allow-Origin"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @SneakyThrows
    private JWTAuthorizationFilter getAuthorizationFilter() {
        return new JWTAuthorizationFilter(authenticationManager(), authenticationHandler(), tokenManager());
    }

    @Bean
    public TokenManager tokenManager() {
        return new TokenManager(tokenService, tokenProperties);
    }

    private JWTAuthenticationFilter getAuthenticationFilter() {
        return new JWTAuthenticationFilter(tokenManager(), authenticationHandler(), objectMapper, tokenProperties);
    }

    @SneakyThrows
    @Bean
    public AuthHandler authenticationHandler() {
        return new AuthHandler(getLdapHelper(),
                bCryptPasswordEncoder(),
                authenticationManager(),
                employeeRepository,
                ldapProperties);
    }

    private LoggingHttpFilter loggingHttpFilter() {
        return new LoggingHttpFilter(employeeRepository, tokenManager());
    }

}
