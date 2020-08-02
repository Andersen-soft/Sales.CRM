package com.andersenlab.crm.model.entities;

import com.andersenlab.crm.aop.audit.Audited;
import com.andersenlab.crm.aop.audit.AuditedField;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

import static javax.persistence.CascadeType.PERSIST;

@Audited(
        occasion = Audited.Occasion.ON_CREATE,
        template = "Создана компания: ${name}"
)
@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "crm_company")
public class Company {

    @Id
    @GeneratedValue
    private Long id;

    @Column(name = "old_id")
    private Long oldId;

    private String name;

    private String url;

    private String phone;

    @Column(columnDefinition = "TEXT")
    private String description;

    private LocalDateTime createDate;

    @AuditedField(
            occasion = AuditedField.Occasion.ON_UPDATE,
            template = "Компания активна - ${isActive}"
    )
    @Column(nullable = false, columnDefinition = "BIT")
    private Boolean isActive;

    @OneToMany(mappedBy = "company", fetch = FetchType.LAZY, cascade = PERSIST)
    private List<Contact> contacts;

    @OneToMany(mappedBy = "company")
    private List<CompanyHistory> companyHistories;

    @OneToMany(mappedBy = "company", fetch = FetchType.LAZY)
    private List<CompanySale> companySales;

    @ManyToOne
    @JoinColumn(name = "responsible_employee_id", referencedColumnName = "id")
    private Employee responsible;

    @Column(name = "dd_last_assignment_date")
    private LocalDateTime ddAssignmentDate;

    @OneToMany(mappedBy = "recommendedBy", fetch = FetchType.LAZY)
    private List<CompanySale> recommendedByCompanySales;

    @ManyToMany
    @JoinTable(name = "crm_company_industry",
            joinColumns = @JoinColumn(name = "company_id"),
            inverseJoinColumns = @JoinColumn(name = "industry_id"))
    private List<Industry> industries;

    public Company(Long id) {
        this.id = id;
    }
}
