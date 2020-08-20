package com.andersenlab.crm.interceptors;

import com.andersenlab.crm.security.JWTAuthenticationFilter;
import lombok.AllArgsConstructor;
import org.hibernate.EmptyInterceptor;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/**
 * Intercepts query and replaces placeholder value with id of current employee
 */
@Component
@AllArgsConstructor
public class FavoritesInterceptor extends EmptyInterceptor {

    @Override
    public String onPrepareStatement(String sql) {
        if (sql.contains("{favoriteEmployeeId}")) {
            return sql.replace("{favoriteEmployeeId}", getCurrentEmployeeId());
        }
        return sql;
    }

    private CharSequence getCurrentEmployeeId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && !(authentication instanceof AnonymousAuthenticationToken)) {
            Object[] details = JWTAuthenticationFilter.getDetails(authentication);
            if (details[0] instanceof Long) {
                return details[0].toString();
            }
        }
        return "null";
    }
}
