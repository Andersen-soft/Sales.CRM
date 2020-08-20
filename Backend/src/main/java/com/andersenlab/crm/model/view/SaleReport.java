package com.andersenlab.crm.model.view;

import com.andersenlab.crm.model.entities.CompanySale;
import com.andersenlab.crm.model.entities.SaleRequestType;
import com.querydsl.core.annotations.PropertyType;
import com.querydsl.core.annotations.QueryType;
import lombok.Data;
import org.hibernate.annotations.Immutable;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "crm_sale_report_view")
@Immutable
public class SaleReport {
    private LocalDateTime createDate;
    @Id
    private Long id;
    @Enumerated(EnumType.ORDINAL)
    private CompanySale.Status status;
    private String category;
    private LocalDateTime statusChangedDate;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate statusDate;
    private Long responsibleId;
    private String responsibleName;
    private Long weight;
    private String mainContact;
    private String contactPosition;
    @Transient
    @QueryType(PropertyType.SIMPLE)
    private String search;
    @Transient
    @QueryType(PropertyType.ENUM)
    @Enumerated(EnumType.ORDINAL)
    private CompanySale.Status excludedStatus;
    private String email;
    private String skype;
    private String socialNetwork;
    private String phone;
    private String personalEmail;
    private Long sourceId;
    private String sourceName;
    private String sourceNameEn;
    private String sourceDescriptionRu;
    private String sourceDescriptionEn;
    private Long countryId;
    private String countryName;
    private String countryNameEn;
    private Long socialContactId;
    private String socialContactName;
    private Long companyId;
    private String companyUrl;
    private String companyName;

    @Column(name = "company_dd_id")
    private Long companyResponsibleRmId;

    @Column(name = "company_dd_name")
    private String companyResponsibleRmName;

    @Column(name = "company_recommendation_id")
    private Long companyRecommendationId;

    @Column(name = "company_recommendation_name")
    private String companyRecommendationName;

    private LocalDateTime createLeadDate;
    private LocalDateTime lastActivityDate;
    @Enumerated(EnumType.STRING)
    private SaleRequestType type;
    @Column(name = "estimation_requests", columnDefinition = "TEXT")
    private String estimationRequests;
    @Column(name = "resume_requests", columnDefinition = "TEXT")
    private String resumeRequests;
    @Column(name = "company_industries", columnDefinition = "MEDIUMTEXT")
    private String companyIndustries;
}