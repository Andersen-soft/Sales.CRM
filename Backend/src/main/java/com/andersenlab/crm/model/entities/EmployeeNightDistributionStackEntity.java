package com.andersenlab.crm.model.entities;

import lombok.Getter;
import lombok.Setter;

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
 * Stack entity for night distribution algorithm.
 * <p>
 * According to the algorithm, for every night distribution queue update, target
 * Employee returns to his previous queue position. This entity describes specified
 * Employee and his previous night distribution assignment time.
 */
@Entity
@Table(name = "crm_company_sale_night_distribution_stack")
@Getter
@Setter
public class EmployeeNightDistributionStackEntity {
    /**
     * This entity's id.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    /**
     * Target night distribution participant.
     */
    @ManyToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    private Employee employee;

    /**
     * Previous night distribution company sale assignment time.
     */
    @Column(name = "lottery_date")
    private LocalDateTime time;
}
