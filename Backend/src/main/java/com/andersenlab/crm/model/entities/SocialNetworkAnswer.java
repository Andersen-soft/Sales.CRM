package com.andersenlab.crm.model.entities;

import com.andersenlab.crm.model.Nameable;
import com.andersenlab.crm.model.Sex;
import com.querydsl.core.annotations.PropertyType;
import com.querydsl.core.annotations.QueryType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import org.springframework.data.annotation.CreatedDate;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.Lob;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.PrePersist;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.validation.constraints.PastOrPresent;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "crm_social_network_answer")
public class SocialNetworkAnswer {

    @Getter
    @AllArgsConstructor
    public enum Status implements Nameable {

        AWAIT("Ожидает"),
        APPLY("Принято"),
        REJECT("Отклонено");

        private final String name;
    }

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assistant_id")
    private Employee assistant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "social_network_contact_id")
    private SocialNetworkContact socialNetworkContact;

    @ManyToOne
    @JoinColumn(name = "source_id", referencedColumnName = "id")
    private Source source;

    @Lob
    @Column(nullable = false)
    private String message;

    @Column(nullable = false)
    private String linkLead;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(name = "sex", nullable = false)
    @Enumerated(EnumType.ORDINAL)
    private Sex sex;

    private String position;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "country_id")
    private Country country;

    private String skype;

    private String email;

    private String emailPrivate;

    private String phone;

    private String companyName;

    private String site;

    private String phoneCompany;

    @Column(name = "create_date", nullable = false, updatable = false)
    @CreatedDate
    private LocalDateTime createDate;

    @Column(name = "status", nullable = false, columnDefinition = "smallint")
    @Enumerated(EnumType.ORDINAL)
    private Status status;

    @PastOrPresent
    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Transient
    @QueryType(PropertyType.SIMPLE)
    private String search;

    @ManyToMany
    @JoinTable(name = "crm_social_answer_industry",
            joinColumns = @JoinColumn(name = "social_id"),
            inverseJoinColumns = @JoinColumn(name = "industry_id"))
    private List<Industry> industryList;

    @PrePersist
    private void prePersist() {
        createDate = LocalDateTime.now();
        status = Status.AWAIT;
    }
}
