package com.andersenlab.crm.utils;

/**
 * Utility class containing topic constants for socket communication.
 */
public final class CrmTopicConstants {
    public static final String TOPIC_AUTO_DISTRIBUTION_DAY_EMPLOYEE_ASSIGNED = "/topic/company_sale/timer";
    public static final String TOPIC_AUTO_DISTRIBUTION_DAY_SALE_REMOVED = "/topic/company_sale/removed_from_distribution";

    private CrmTopicConstants() {

    }
}