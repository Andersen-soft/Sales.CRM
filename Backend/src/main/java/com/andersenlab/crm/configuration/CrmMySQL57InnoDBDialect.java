package com.andersenlab.crm.configuration;

import org.hibernate.dialect.MySQL57InnoDBDialect;
import org.hibernate.dialect.function.StandardSQLFunction;
import org.hibernate.type.StandardBasicTypes;

/**
 * CrmMySQL57InnoDBDialect provides support of MySQL fun group_concat() and keyword "separator".
 *
 * @author Roman_Haida
 * 15.07.2019
 */
public class CrmMySQL57InnoDBDialect extends MySQL57InnoDBDialect {
    public CrmMySQL57InnoDBDialect() {
        super();
        registerFunction("group_concat", new StandardSQLFunction("group_concat", StandardBasicTypes.STRING));
        registerKeyword("SEPARATOR");
    }
}
