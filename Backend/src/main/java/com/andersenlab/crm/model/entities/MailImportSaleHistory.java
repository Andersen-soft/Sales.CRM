package com.andersenlab.crm.model.entities;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "crm_company_sale_mail_history")
@Data
public class MailImportSaleHistory {
    public enum MailImportSaleResult {
        SUCCESS_SALE,
        SUCCESS_ACTIVITY,
        EMPLOYEE_NOT_FOUND,
        EMPLOYEE_NOT_SALES,
        NO_CONTACT_EMAIL
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "company_sale_id", referencedColumnName = "id")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private CompanySale companySale;

    @Column(name = "contact_email")
    private String contactEmail;

    @Column(name = "sales_email")
    private String salesEmail;

    @Column(name = "message", columnDefinition = "TEXT")
    private String message;

    @Column(name = "request_result")
    @Enumerated(value = EnumType.STRING)
    private MailImportSaleResult mailImportSaleResult;
}
