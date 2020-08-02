package com.andersenlab.crm.model.entities;

import com.andersenlab.crm.model.Nameable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@Table(name = "crm_company_sale_temp")
public class CompanySaleTemp {

    @Getter
    @AllArgsConstructor
    public enum Status implements Nameable {
        DAY("day"),
        NIGHT("night"),
        REGIONAL("regional");

        private final String name;
    }

    @Id
    @GeneratedValue
    @NonNull
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sale_id", referencedColumnName = "id")
    private CompanySale companySale;

    @ManyToOne
    @JoinColumn(name = "responsible_id", referencedColumnName = "id")
    private Employee responsible;

    @Column(name = "assignment_date")
    private LocalDateTime autoDistributionDate;

    @Column(nullable = false, columnDefinition = "BIT")
    private Boolean isSaleApproved;

    @Enumerated(EnumType.STRING)
    private Status status;

    // Auto distribution mappings
    @ManyToMany
    @JoinTable(name = "crm_company_sale_day_distribution",
            joinColumns = @JoinColumn(name = "sale_temp_id"),
            inverseJoinColumns = @JoinColumn(name = "employee_id"))
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Set<Employee> dayDistributionQueue = new HashSet<>();

    /*
     CompanySaleTemp entity owns the many-to-many relationship in order to simplify deletion of likes in `crm_employee_company_sale_temp` table
     when CompanySaleTemp is deleted itself
    */
    @ManyToMany
    @JoinTable(name = "crm_employee_company_sale_temp",
            joinColumns = @JoinColumn(name = "company_sale_temp_id"),
            inverseJoinColumns = @JoinColumn(name = "employee_id"))
    private Set<Employee> employeesLiked = new HashSet<>();

    public void addEmployeeLike(Employee employee) {
        this.employeesLiked.add(employee);
        employee.getCompanySaleTempsLiked().add(this);
    }
}