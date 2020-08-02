package com.andersenlab.crm.model.entities;

import com.querydsl.core.annotations.PropertyType;
import com.querydsl.core.annotations.QueryType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.PrePersist;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.persistence.UniqueConstraint;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "crm_social_network_contact",
        uniqueConstraints = {@UniqueConstraint(columnNames = {"social_network_user_id", "source_id"}, name = "UK_SOCIAL_NETWORK_CONTACT")})
public class SocialNetworkContact {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "social_network_user_id", referencedColumnName = "id")
    private SocialNetworkUser socialNetworkUser;

    @ManyToOne
    @JoinColumn(name = "source_id", referencedColumnName = "id")
    private Source source;

    @ManyToOne
    @JoinColumn(name = "sales_id", referencedColumnName = "id")
    private Employee sales;

    @ManyToOne
    @JoinColumn(name = "sales_assistant_id", referencedColumnName = "id")
    private Employee salesAssistant;

    @Column(name = "create_date")
    private LocalDateTime createDate;

    @Transient
    @QueryType(PropertyType.SIMPLE)
    private String searchQuery;

    @PrePersist
    private void prePersist() {
        createDate = LocalDateTime.now();
    }
}
