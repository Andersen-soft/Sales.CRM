package com.andersenlab.crm.model.entities;

import com.andersenlab.crm.model.Sex;
import com.querydsl.core.annotations.PropertyType;
import com.querydsl.core.annotations.QueryType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.PrePersist;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.validation.constraints.PastOrPresent;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "crm_contact")
public class Contact extends PrivateData {

    private String position;

    @Column(name = "social_network")
    private String socialNetwork;

    @Column(name = "old_id")
    private Long oldId;

    @ManyToOne
    @JoinColumn(name = "country_id", referencedColumnName = "id")
    private Country country;

    @Column(name = "personal_email")
    private String personalEmail;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", referencedColumnName = "id")
    private Company company;

    @Column(name = "create_date")
    private LocalDateTime createDate;

    @Column(name = "sex", nullable = false)
    @Enumerated(EnumType.ORDINAL)
    private Sex sex;

    @OneToMany(mappedBy = "mainContact", fetch = FetchType.EAGER)
    private List<CompanySale> sales;

    @ManyToMany(mappedBy = "contacts")
    private Set<Activity> activities = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "social_network_user_id", referencedColumnName = "id")
    private SocialNetworkUser socialNetworkUser;

    @Transient
    @QueryType(PropertyType.STRING)
    private String fio;

    @Column
    private String email;

    @Transient
    @QueryType(PropertyType.STRING)
    private String emails;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @PastOrPresent
    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    public Contact(Long id) {
        super(id);
    }

    @PrePersist
    private void prePersist() {
        createDate = LocalDateTime.now();
        setIsActive(true);
    }
}
