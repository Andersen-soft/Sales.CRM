package com.andersenlab.crm.model.entities;

import com.andersenlab.crm.aop.audit.Audited;
import com.andersenlab.crm.aop.audit.AuditedField;
import com.andersenlab.crm.model.Nameable;
import com.querydsl.core.annotations.PropertyType;
import com.querydsl.core.annotations.QueryType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.Formula;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.PrePersist;
import javax.persistence.Table;
import javax.persistence.Transient;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.ResourceBundle;
import java.util.stream.Collectors;

import static com.andersenlab.crm.aop.audit.Audited.Occasion.ON_CREATE;
import static com.andersenlab.crm.aop.audit.AuditedField.Occasion.ON_UPDATE;
import static com.andersenlab.crm.services.i18n.I18nConstants.BUNDLE_NAME;
import static com.andersenlab.crm.services.i18n.I18nConstants.LANGUAGE_TAG_EN;
import static com.andersenlab.crm.services.i18n.I18nConstants.LANGUAGE_TAG_RU;

@Audited(
        occasion = ON_CREATE,
        template = "Продажа создана",
        templateEn = "The sale was created"
)
@Entity
@Table(name = "crm_company_sale")
@Data
@NoArgsConstructor
@RequiredArgsConstructor
public class CompanySale {

    @Getter
    @AllArgsConstructor
    public enum Status implements Nameable {
        LEAD("companySale.status.lead"),
        INWORK("companySale.status.inWork"),
        OPPORTUNITY("companySale.status.opportunity"),
        CONTRACT("companySale.status.contract"),
        PRELEAD("companySale.status.preLead"),
        ARCHIVE("companySale.status.archive");

        private final String name;

        public static String fromString(String text) {
            for (Status b : Status.values()) {
                if (b.name.equalsIgnoreCase(text)) {
                    return b.name();
                }
            }
            return "%";
        }

        public static List<Status> defineStatuses(String value) {
            Locale localeRu = Locale.forLanguageTag(LANGUAGE_TAG_RU);
            Locale localeEn = Locale.forLanguageTag(LANGUAGE_TAG_EN);

            ResourceBundle bundleRu = ResourceBundle.getBundle(
                    BUNDLE_NAME, localeRu);
            ResourceBundle bundleEn = ResourceBundle.getBundle(
                    BUNDLE_NAME, localeEn);

            return Arrays.stream(Status.values())
                    .filter(s -> bundleEn.getString(s.getName())
                            .toUpperCase()
                            .contains(value.toUpperCase())
                            || bundleRu.getString(s.getName())
                            .toUpperCase()
                            .contains(value.toUpperCase()))
                    .collect(Collectors.toList());
        }
    }

    @Getter
    @AllArgsConstructor
    public enum Category implements Nameable {
        A("companySale.category.a"),
        B("companySale.category.b"),
        C("companySale.category.c");

        private final String name;
    }

    @Id
    @GeneratedValue
    @NonNull
    private Long id;

    @Column(name = "old_id")
    private Long oldId;

    @ManyToOne
    @JoinColumn(name = "responsible_id", referencedColumnName = "id")
    private Employee responsible;

    @Column(name = "create_date")
    private LocalDateTime createDate;

    @Column(name = "create_lead_date")
    private LocalDateTime createLeadDate;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, columnDefinition = "BIT")
    private Boolean isSaleApproved;

    @Column(name = "status_changed_date")
    private LocalDateTime statusChangedDate;

    @Column(name = "lottery_date")
    private LocalDateTime lotteryDate;

    @Column(name = "time_status")
    @Enumerated(EnumType.STRING)
    private CompanySaleTemp.Status timeStatus;

    @ManyToOne
    @JoinColumn(name = "main_contact_id", referencedColumnName = "id")
    private Contact mainContact;

    @OneToMany(mappedBy = "companySale", fetch = FetchType.LAZY)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private List<ResumeRequest> resumeRequests;

    @OneToMany(mappedBy = "companySale", fetch = FetchType.LAZY)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private List<EstimationRequest> estimationRequests;

    @AuditedField(
            occasion = ON_UPDATE,
            template = "Статус продажи изменен с ${#status.name} на ${status.name}")
    @Enumerated(EnumType.ORDINAL)
    private Status status;

    @Transient
    @QueryType(PropertyType.ENUM)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Status excludedStatus;

    @OneToMany(mappedBy = "companySale", fetch = FetchType.LAZY)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private List<Activity> activities;

    @OneToMany(mappedBy = "companySale", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private List<CompanySaleHistory> histories;

    @ManyToOne
    @JoinColumn(name = "company_id", referencedColumnName = "id")
    private Company company;

    @ManyToOne
    @JoinColumn(name = "source_id", referencedColumnName = "id")
    private Source source;

    @ManyToOne
    @JoinColumn(name = "company_recommendation_id", referencedColumnName = "id")
    private Company recommendedBy;

    @Column(name = "weight")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Long weight;

    @OneToOne
    @JoinColumn(name = "last_activity_id", referencedColumnName = "id")
    private Activity lastActivity;

    @OneToOne
    @JoinColumn(name = "first_activity_id", referencedColumnName = "id")
    private Activity firstActivity;

    @Column(name = "next_activity_date")
    private LocalDateTime nextActivityDate;

    @Column(nullable = false, columnDefinition = "BIT")
    private Boolean isActive;

    @AuditedField(
            occasion = ON_UPDATE,
            template = "Категория продажи")
    @Column(name = "category")
    @Enumerated(value = EnumType.STRING)
    private Category category;

    @Column(name = "day_auto_distribution",
            nullable = false,
            columnDefinition = "BIT")
    private boolean inDayAutoDistribution;

    @Formula("" +
            "(SELECT CASE" +
            "          WHEN (EXISTS(SELECT * FROM crm_company_sale_temp WHERE crm_company_sale_temp.sale_id = id)" +
            "               AND (SELECT status FROM crm_company_sale_temp WHERE crm_company_sale_temp.sale_id = id) = 'DAY')" +
            "          THEN (SELECT crm_company_sale_temp.responsible_id FROM crm_company_sale_temp WHERE crm_company_sale_temp.sale_id = id)" +
            "          ELSE NULL" +
            "       END)")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Long dayDistributionEmployeeId;

    /*QDsl auxiliary fields for search*/

    @Formula("(select crm_company.name from crm_company\n" +
            "where crm_company.id = company_id)")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private String companyName;

    @Formula("(select concat(ifnull(p.first_name, ''), ifnull(concat(' ', p.last_name), '')) from crm_private_data p\n" +
            "where p.id = main_contact_id)")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private String mainContactName;

    @Formula("(select c.email from crm_contact c where c.id = main_contact_id)")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private String mainContactEmail;

    @Formula("(select c.skype from crm_private_data c where c.id = main_contact_id)")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private String mainContactSkype;

    @Formula("(select snu.name from crm_contact con \n" +
            "\tleft join crm_social_network_user snu on con.social_network_user_id = snu.id \n" +
            "    where con.id = main_contact_id)")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private String socialContact;

    //keyword 'SEPARATOR' was swapped with ',' due to servers and dialect incompatibility
    @Formula("(SELECT GROUP_CONCAT(CONCAT(srr.id, ' ', srr.name) , ';')\n" +
            "from crm_estimation_request erq \n" +
            "inner join crm_sale_request srr ON srr.id = erq.id \n" +
            "where erq.company_sale_id = id)")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private String estimationNames;

    @Formula("(SELECT GROUP_CONCAT(CONCAT(srr.id, ' ', srr.name) , ';')\n" +
            "from crm_resume_request rrq \n" +
            "inner join crm_sale_request srr ON srr.id = rrq.id \n" +
            "where rrq.company_sale_id = id)")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private String resumeNames;

    @Transient
    @QueryType(PropertyType.SIMPLE)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Boolean isPastActivity;

    @Transient
    @QueryType(PropertyType.STRING)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private String search;

    @PrePersist
    private void prePersist() {
        if (createDate == null) {
            createDate = LocalDateTime.now();
        }

        if (createLeadDate == null) {
            createLeadDate = LocalDateTime.now();
        }

        isActive = true;
    }
}
