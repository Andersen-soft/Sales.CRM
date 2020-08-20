package com.andersenlab.crm.model.entities;

import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.time.LocalDateTime;

/**
 * Entity representing a single company sale google ad record.
 * Some customers visit our website via google ads. This record represents information about company sales,
 * that has been created by specified customers. Later on, these records are submitted to google servers to
 * create some statistics.
 * <p>
 * Only company sales that has been imported from company website will appear in these records.
 */
@Entity
@Table(name = "crm_company_sale_google_ad_record")
@Data
public class CompanySaleGoogleAdRecord {
    /**
     * ID of this record.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    /**
     * Related company sale object.
     */
    @ManyToOne
    @JoinColumn(name = "company_sale_id", referencedColumnName = "id")
    private CompanySale companySale;

    /**
     * GLCID (Google click ID) field. It is generated every time a customer visits website via google ad,
     * and passed to CRM for every sale import request.
     * Essential for exporting specified record.
     */
    @Column(name = "gclid")
    private String googleClickId;

    /**
     * Site URI that represents the first page a customer has visited via google ad.
     */
    @Column(name = "first_point")
    private String siteFirstPoint;

    /**
     * Site URI that represents the last page a customer has visited, before submitting a form.
     */
    @Column(name = "last_point")
    private String siteLastPoint;

    /**
     * Site URI that represents the form, for which specified customer has submitted.
     */
    @Column(name = "session_point")
    private String siteSessionPoint;

    /**
     * Conversion name field, needed to sort different records by categories.
     * Essential for exporting specified record.
     */
    @Column(name = "conversion_name")
    private String conversionName;

    /**
     * Conversion time field. Represents time when company sale is switched to one of specified statuses.
     * Essential for exporting specified record.
     */
    @Column(name = "conversion_date")
    private LocalDateTime conversionDate;

    /**
     * Flag that shows if specified record was already exported, or not.
     */
    @Column(name = "is_exported", columnDefinition = "BIT")
    private boolean recordExported;
}
