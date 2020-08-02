package com.andersenlab.crm.utils;

/**
 * Class containing general constants for this application.
 */
public final class CrmConstants {
    /**
     * String value to search for site source.
     * Used for sale import API methods, and sale distribution algorithm.
     */
    public static final String SOURCE_NAME_SITE = "Site";

    /**
     * String value to search for email source.
     * Used for company sale specific methods.
     */
    public static final String SOURCE_NAME_EMAIL = "E-mail";

    /**
     * String value to search for recommendation source.
     * Used for company & company sale specific methods, and DD distribution algorithm.
     */
    public static final String SOURCE_NAME_REFERENCE = "Recommendation";

    /**
     * String value to search for recommendation source, in RU language.
     * Used for company & company sale specific methods, and DD distribution algorithm.
     */
    public static final String SOURCE_NAME_REFERENCE_RU = "Референция";

    /**
     * Empty value replacer for sale report view fields.
     * Used for sale report specific methods.
     */
    public static final String NO_VALUE_REPLACER = "Отсутствует";

    /**
     * String login value to search for VN user.
     * Used in mail notification for sale distribution algorithm. Duplicates sent mail for specified user.
     */
    public static final String VN_LOGIN = "vn";

    /**
     * String login value to search for bot user.
     * Used for sale distribution and DD distribution algorithms.
     */
    public static final String CRM_BOT_LOGIN = "site";

    private CrmConstants() {

    }
}
