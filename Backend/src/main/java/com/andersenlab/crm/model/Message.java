package com.andersenlab.crm.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;

import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Message {
    @Getter
    @AllArgsConstructor
    public enum Template {
        PLAIN_TEXT("PLAIN_TEXT"),
        ACTIVITY_REPORT("activityReport.ftl"),
        AUTO_DISTRIBUTION_DAY_SALE_SET_EN("auto-distribution-day-sale-set-en.ftl"),
        AUTO_DISTRIBUTION_DAY_SALE_SET_RU("auto-distribution-day-sale-set-ru.ftl"),
        AUTO_DISTRIBUTION_DAY_SALE_REJECTED_EN("auto-distribution-day-sale-rejected-en.ftl"),
        AUTO_DISTRIBUTION_DAY_SALE_REJECTED_RU("auto-distribution-day-sale-rejected-ru.ftl"),
        AUTO_DISTRIBUTION_DAY_SALE_REMOVED_EN("auto-distribution-day-sale-removed-en.ftl"),
        AUTO_DISTRIBUTION_DAY_SALE_REMOVED_RU("auto-distribution-day-sale-removed-ru.ftl"),
        AUTO_DISTRIBUTION_DAY_SALE_REJECTED_SALES_HEADS_EN("auto-distribution-day-sale-rejected-sales-heads-en.ftl"),
        AUTO_DISTRIBUTION_DAY_SALE_REJECTED_SALES_HEADS_RU("auto-distribution-day-sale-rejected-sales-heads-ru.ftl"),
        AUTO_DISTRIBUTION_DAY_NO_PARTICIPANTS_EN("auto-distribution-day-no-participants-en.ftl"),
        AUTO_DISTRIBUTION_DAY_NO_PARTICIPANTS_RU("auto-distribution-day-no-participants-ru.ftl"),
        AUTO_DISTRIBUTION_NIGHT_NO_PARTICIPANTS_EN("auto-distribution-night-no-participants-en.ftl"),
        AUTO_DISTRIBUTION_NIGHT_NO_PARTICIPANTS_RU("auto-distribution-night-no-participants-ru.ftl"),
        AUTO_DISTRIBUTION_NIGHT_UNASSIGNED_SALES_EN("auto-distribution-night-unassigned-sales-en.ftl"),
        AUTO_DISTRIBUTION_NIGHT_UNASSIGNED_SALES_RU("auto-distribution-night-unassigned-sales-ru.ftl"),
        AUTO_DISTRIBUTION_SALE_SET_RU("auto-distribution-sale-set-ru.ftl"),
        AUTO_DISTRIBUTION_SALE_SET_EN("auto-distribution-sale-set-en.ftl"),
        COMPANY_SALE_ARCHIVED_EN("company-sale-archived-en.ftl"),
        COMPANY_SALE_ARCHIVED_RU("company-sale-archived-ru.ftl"),
        COMPANY_DISTRIBUTION_REFERENCE_DIFF_EN("company_distribution_reference_diff_en.ftl"),
        COMPANY_DISTRIBUTION_REFERENCE_DIFF_RU("company_distribution_reference_diff_ru.ftl"),
        IMPORT_SALE_ACTIVITY_CREATED_EN("import-sale-activity-created-en.ftl"),
        IMPORT_SALE_ACTIVITY_CREATED_RU("import-sale-activity-created-ru.ftl"),
        MAIL_EXPRESS_SALE_CREATED_EN("mail-express-sale-created-en.ftl"),
        MAIL_EXPRESS_SALE_CREATED_RU("mail-express-sale-created-ru.ftl"),
        RESUME_REQUEST_CREATED_EN("resume-request-created-en.ftl"),
        RESUME_REQUEST_CREATED_RU("resume-request-created-ru.ftl"),
        RESUME_COMMENT_WAS_ADDED("resume-comment-was-added.ftl"),
        RESUME_REQUEST_COMMENT_WAS_ADDED_OR_UPDATE("resume-request-comment-was-added-or-create.ftl"),
        RESUME_REQUEST_AUTO_DISTRIBUTION("resume-request-auto-distribution.ftl"),
        RESUME_REQUEST_AUTO_DISTRIBUTION_NO_COMMENT("resume-request-auto-distribution-no-comment.ftl"),
        RESUME_REQUEST_AUTO_DISTRIBUTION_NO_COMMENT_HOUR("resume-request-auto-distribution-no-comment-hour.ftl"),
        RESUME_REQUEST_STATUS_WAS_UPDATED("resume-request-status-was-updated.ftl"),
        RESUME_STATUS_WAS_SET("resume-status-was-set.ftl"),
        RESUME_REQUEST_STATUS_WAS_SET("resume-request-status-was-set.ftl"),
        RESUME_STATUS_WAS_UPDATED("resume-status-was-updated.ftl"),
        SALES_REQUEST_FOR_RM("sales-request-for-responsible-rm.ftl"),
        SALES_REQUEST_FOR_LEAD("sales-request-for-lead.ftl"),
        ESTIMATION_REQUEST_CREATED_EN("estimation-request-created-en.ftl"),
        ESTIMATION_REQUEST_CREATED_RU("estimation-request-created-ru.ftl"),
        ESTIMATION_REQUEST_STATUS_WAS_SET("estimation-request-status-was-set.ftl"),
        ESTIMATION_REQUEST_STATUS_WAS_UPDATED("estimation-request-status-was-updated.ftl"),
        ESTIMATION_REQUEST_COMMENT_WAS_ADDED_OR_UPDATE("estimation-request-comment-was-added-or-create.ftl"),
        EMPLOYEE_REGISTER("employee-register.ftl"),
        EMPLOYEE_AD_REGISTER("employee-ad-register.ftl"),
        EMPLOYEE_PASSWORD_RESET("employee-password-reset.ftl"),
        EMPLOYEE_LOGIN_RESET("employee-login-reset.ftl"),
        RESPONSIBLE_CHANGE_LEAD_AUTO_RU("change_responsible_auto_ru.ftl"),
        RESPONSIBLE_CHANGE_LEAD_AUTO_EN("change_responsible_auto_en.ftl"),
        RESPONSIBLE_CHANGE_LEAD_MANUAL_RU("change_responsible_manual_ru.ftl"),
        RESPONSIBLE_CHANGE_LEAD_MANUAL_EN("change_responsible_manual_en.ftl"),
        SOCIAL_NETWORK_ANSWER_CREATED("social_network_answer_created.ftl");

        private final String name;
    }

    @NonNull
    private String subject;
    @NonNull
    private String body;
    @NonNull
    private Map<String, Object> args;
    @NonNull
    private Template template;
}
