package com.andersenlab.crm.model.entities;

import com.querydsl.core.annotations.PropertyType;
import com.querydsl.core.annotations.QueryType;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.PrePersist;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotEmpty;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "crm_employee")
public class Employee extends PrivateData implements Responsible {

    @Column
    private String login;

    @Column(unique = true)
    private String email;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "crm_employee_emails",
            joinColumns = @JoinColumn(name = "employee_id", referencedColumnName = "id")
    )
    @Column(name = "email")
    private Set<String> additionalEmails = new HashSet<>();

    @Column(name = "old_id")
    private Long oldId;

    @Column
    private String password;

    @Column(name = "lottery_participant", columnDefinition = "BIT", nullable = false)
    private Boolean lotteryParticipant;

    @Column(name = "responsible_rm", columnDefinition = "BIT", nullable = false)
    private Boolean responsibleRM;

    @Column
    private LocalDateTime createDate;

    @Column
    private LocalDateTime lastAccessDate;

    @OneToOne(mappedBy = "employee")
    private EmployeeArchive employeeArchive;

    @Column(name = "may_db_auth", columnDefinition = "BIT")
    private Boolean mayDBAuth;

    @Column(name = "auto_distribution_date")
    private LocalDateTime autoDistributionDate;

    @Column(name = "distribution_date_day")
    private LocalDateTime dayDistributionDate;

    @Column(name = "distribution_date_night")
    private LocalDateTime nightDistributionDate;

    @Column(name = "distribution_date_regional")
    private LocalDateTime regionalDistributionDate;

    @Column(name = "distribution_day_participant", columnDefinition = "BIT")
    private boolean dayDistributionParticipant;

    @Column(name = "distribution_night_participant", columnDefinition = "BIT")
    private boolean nightDistributionParticipant;

    @Column(name = "distribution_regional_participant", columnDefinition = "BIT")
    private boolean regionalDistributionParticipant;

    @Column(name = "distribution_date_rm")
    private LocalDateTime distributionDateRm;

    @Transient
    @QueryType(PropertyType.ENTITY)
    private Role role;

    @NotEmpty
    @Column(nullable = false)
    @JoinTable(name = "crm_employee_role",
            joinColumns = @JoinColumn(name = "employee_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "role_id", referencedColumnName = "id"),
            uniqueConstraints = {@UniqueConstraint(columnNames = {"employee_id", "role_id"})}
    )
    @ManyToMany(fetch = FetchType.EAGER)
    private Set<Role> roles = new HashSet<>();

    @JoinTable(name = "crm_employee_country",
            joinColumns = @JoinColumn(name = "employee_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "country_id", referencedColumnName = "id"),
            uniqueConstraints = {@UniqueConstraint(columnNames = {"employee_id", "country_id"})}
    )
    @ManyToMany
    private Set<Country> countries = new HashSet<>();

    @Column
    private String position;

    @Column(name = "telegram_username")
    private String telegramUsername;

    @Column(name = "employee_lang")
    private String employeeLang;

    @OneToOne
    @JoinColumn(name = "mentor_id", referencedColumnName = "id")
    private Employee mentor;

    @OneToMany(mappedBy = "responsibleForRequest", fetch = FetchType.LAZY)
    private List<SaleRequest> requestsResponsible;

    @OneToMany(mappedBy = "responsibleForSaleRequest", fetch = FetchType.LAZY)
    private List<SaleRequest> saleRequestsResponsible;

    @OneToMany(mappedBy = "responsibleRM", fetch = FetchType.LAZY)
    private List<SaleRequest> saleRequestsRm;

    @OneToMany(mappedBy = "responsibleHr", fetch = FetchType.LAZY)
    private List<Resume> resumeList;

    @OneToMany(mappedBy = "author", fetch = FetchType.LAZY)
    private List<SaleRequest> requestAuthor;

    @OneToMany(mappedBy = "employee", fetch = FetchType.LAZY)
    private List<History> histories;

    @OneToMany(mappedBy = "employee", fetch = FetchType.LAZY)
    private List<Comment> comments;

    @OneToMany(mappedBy = "responsible", fetch = FetchType.LAZY)
    private List<CompanySale> companySales;

    @OneToMany(mappedBy = "responsible", fetch = FetchType.LAZY)
    private List<Activity> activities;

    @ManyToMany
    @JoinTable(name = "crm_employee_sale_request",
            joinColumns = @JoinColumn(name = "employee_id"),
            inverseJoinColumns = @JoinColumn(name = "sale_request_id"))
    private List<SaleRequest> favoriteSaleRequests;

    @ManyToMany(mappedBy = "employeesLiked")
    private Set<CompanySaleTemp> companySaleTempsLiked = new HashSet<>();

    @OneToMany(mappedBy = "employee", fetch = FetchType.LAZY)
    private List<EmployeeNightDistributionStackEntity> nightDistributionStack = new ArrayList<>();

    @ManyToMany(mappedBy = "dayDistributionQueue")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Set<CompanySaleTemp> dayDistributionSalesSet = new HashSet<>();

    public Employee(Long id) {
        super(id);
    }

    @PrePersist
    private void prePersist() {
        this.createDate = LocalDateTime.now();
        this.setIsActive(true);
        if (Objects.isNull(this.lotteryParticipant)) {
            this.setLotteryParticipant(false);
        }
    }

    @Override
    public Employee getResponsible() {
        return this;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        Employee employee = (Employee) o;
        return login.equals(employee.login) &&
                email.equals(employee.email);
    }

    @Override
    public int hashCode() {
        return Objects.hash(login, email);
    }
}
