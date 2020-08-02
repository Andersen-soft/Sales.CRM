package com.andersenlab.crm.model.view;

import com.andersenlab.crm.model.Sex;
import com.andersenlab.crm.model.entities.Country;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.model.entities.SocialNetworkAnswer;
import com.andersenlab.crm.model.entities.SocialNetworkContact;
import com.andersenlab.crm.model.entities.Source;
import com.querydsl.core.annotations.PropertyType;
import com.querydsl.core.annotations.QueryType;
import lombok.Data;
import org.hibernate.annotations.Immutable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "crm_social_network_answer_sales_head_view")
@Immutable
public class SocialNetworkAnswerSalesHeadView {
    @Id
    private Long id;
    @Column(columnDefinition = "smallint")
    @Enumerated(EnumType.ORDINAL)
    private SocialNetworkAnswer.Status status;
    private LocalDateTime createDate;
    @ManyToOne
    private Employee assistant;
    @ManyToOne
    private Employee responsible;
    @ManyToOne
    private Source source;
    @ManyToOne
    private SocialNetworkContact socialNetworkContact;
    @Lob
    private String message;
    private String linkLead;
    private String firstName;
    private String lastName;
    private Sex sex;
    @ManyToOne
    private Country country;
    private String companyName;
    @Transient
    @QueryType(PropertyType.SIMPLE)
    private String search;
}
