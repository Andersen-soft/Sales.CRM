package com.andersenlab.crm.model.entities;

import lombok.Data;

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
import java.time.LocalDateTime;

@Entity
@Table(name = "crm_company_distribution_history")
@Data
public class CompanyDistributionHistory {
    public enum CompanyDistributionEvent {
        DISTRIBUTION_ASSIGNMENT,
        DISTRIBUTION_ALREADY_ASSIGNED,
        REFERENCE_ASSIGNMENT,
        REFERENCE_SAME_DD_SPECIFIED,
        REFERENCE_DIFFERENT_DD_SPECIFIED,
        MANUAL_ASSIGNMENT,
        MANUAL_ASSIGNMENT_NO_QUEUE_UPDATE
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "company_id", referencedColumnName = "id")
    private Company company;

    @Column(name = "event")
    @Enumerated(value = EnumType.STRING)
    private CompanyDistributionEvent event;

    @ManyToOne
    @JoinColumn(name = "author_id", referencedColumnName = "id")
    private Employee author;

    @ManyToOne
    @JoinColumn(name = "reference_dd_id", referencedColumnName = "id")
    private Employee referenceDD;

    @ManyToOne
    @JoinColumn(name = "previous_dd_id", referencedColumnName = "id")
    private Employee previousDD;

    @ManyToOne
    @JoinColumn(name = "current_dd_id", referencedColumnName = "id")
    private Employee currentDD;

    @Column(name = "event_date")
    private LocalDateTime eventDate;
}
