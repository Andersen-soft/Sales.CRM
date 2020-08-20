package com.andersenlab.crm.model.entities;

import com.andersenlab.crm.aop.audit.AuditedField;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.Formula;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.PrePersist;
import javax.persistence.PreRemove;
import javax.persistence.Table;
import java.time.LocalDateTime;
import java.util.List;

import static com.andersenlab.crm.aop.audit.AuditedField.Occasion.ON_SET;
import static com.andersenlab.crm.aop.audit.AuditedField.Occasion.ON_UNSET;
import static com.andersenlab.crm.aop.audit.AuditedField.Occasion.ON_UPDATE;
import static com.andersenlab.crm.model.entities.SqlConstants.FAVORITE_SALE_REQUESTS;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Data
@RequiredArgsConstructor
@NoArgsConstructor
@Table(name = "crm_sale_request")
public class SaleRequest {

    @Id
    @GeneratedValue
    @NonNull
    private Long id;

    @Column
    private LocalDateTime createDate;

    @AuditedField(occasion = ON_UPDATE,
            template = "Назавние изменено с ${#name} на ${name}",
            templateEn = "Name ${#name} was changed to ${name}"
    )
    @Column
    private String name;

    @AuditedField(occasion = ON_UPDATE,
            template = "Дедлайн изменен с ${#deadline} на ${deadline}",
            templateEn = "Deadline ${#deadline} was changed to ${deadline}"
    )
    @Column
    private LocalDateTime deadline;

    @Column
    private LocalDateTime startAt;

    @Column
    private Boolean isActive;

    @OneToMany(mappedBy = "saleRequest", cascade = CascadeType.MERGE)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private List<File> files;

    @ManyToOne
    @JoinColumn(name = "author_id", referencedColumnName = "id")
    private Employee author;

    @AuditedField(occasion = ON_SET,
            template = "Ответственный RM изменен на ${responsibleRM.lastName} ${responsibleRM.firstName}",
            templateEn = "Responsible RM was changed to ${responsibleRM.lastName} ${responsibleRM.firstName}"
    )
    @AuditedField(occasion = ON_UPDATE,
            template = "Ответственный RM изменен с ${#responsibleRM.lastName} ${#responsibleRM.firstName} "
                    + "на ${responsibleRM.lastName} ${responsibleRM.firstName}",
            templateEn = "Responsible RM ${#responsibleRM.lastName} ${#responsibleRM.firstName} "
                    + "was changed to ${responsibleRM.lastName} ${responsibleRM.firstName}"
    )
    @AuditedField(occasion = ON_UNSET,
            template = "Ответственный RM изменен с ${#responsibleRM.lastName} ${#responsibleRM.firstName} "
                    + "на Отсутствует",
            templateEn = "Responsible RM ${#responsibleRM.lastName} ${#responsibleRM.firstName} "
                    + "was changed to Unfilled"
    )
    @ManyToOne
    @JoinColumn(name = "responsible_rm_id", referencedColumnName = "id")
    private Employee responsibleRM;

    @ManyToOne
    @JoinColumn(name = "first_responsible_rm", referencedColumnName = "id")
    private Employee firstResponsibleRm;

    @AuditedField(onRootSubtype = EstimationRequest.class, occasion = ON_SET,
            template = "Ответственный за оценку изменен на ${responsibleForRequest.lastName} ${responsibleForRequest.firstName}",
            templateEn = "Responsible for estimation was changed to ${responsibleForRequest.lastName} ${responsibleForRequest.firstName}"
    )
    @AuditedField(onRootSubtype = EstimationRequest.class, occasion = ON_UPDATE,
            template = "Ответственный за оценку изменен с ${#responsibleForRequest.lastName} ${#responsibleForRequest.firstName} "
                    + "на ${responsibleForRequest.lastName} ${responsibleForRequest.firstName}",
            templateEn = "Responsible for estimation ${#responsibleForRequest.lastName} ${#responsibleForRequest.firstName} "
                    + "was changed to ${responsibleForRequest.lastName} ${responsibleForRequest.firstName}"
    )
    @AuditedField(onRootSubtype = EstimationRequest.class, occasion = ON_UNSET,
            template = "Ответственный за оценку изменен с ${#responsibleForRequest.lastName} ${#responsibleForRequest.firstName} "
                    + "изменен на Отсутствует",
            templateEn = "Responsible for estimation ${#responsibleForRequest.lastName} ${#responsibleForRequest.firstName} "
                    + "was changed to Unfilled"
    )
    @ManyToOne
    @JoinColumn(name = "responsible_for_request_id", referencedColumnName = "id")
    private Employee responsibleForRequest;

    @AuditedField(occasion = ON_SET,
            template = "Ответственный изменен на ${responsibleForSaleRequest.lastName} ${responsibleForSaleRequest.firstName}",
            templateEn = "Responsible was changed to ${responsibleForSaleRequest.lastName} ${responsibleForSaleRequest.firstName}"
    )
    @AuditedField(occasion = ON_UPDATE,
            template = "Ответственный изменен с ${#responsibleForSaleRequest.lastName} ${#responsibleForSaleRequest.firstName} "
                    + "на ${responsibleForSaleRequest.lastName} ${responsibleForSaleRequest.firstName}",
            templateEn = "Responsible ${#responsibleForSaleRequest.lastName} ${#responsibleForSaleRequest.firstName} "
                    + "was changed to ${responsibleForSaleRequest.lastName} ${responsibleForSaleRequest.firstName}"
    )
    @AuditedField(occasion = ON_UNSET,
            template = "Ответственный изменен с ${#responsibleForSaleRequest.lastName} ${#responsibleForSaleRequest.firstName} "
                    + "изменен на Отсутствует",
            templateEn = "Responsible ${#responsibleForSaleRequest.lastName} ${#responsibleForSaleRequest.firstName} "
                    + "was changed to Unfilled"
    )
    @ManyToOne
    @JoinColumn(name = "responsible_for_sale_request_id", referencedColumnName = "id")
    private Employee responsibleForSaleRequest;

    @Formula(value = FAVORITE_SALE_REQUESTS)
    private Boolean isFavorite;

    @ManyToMany(mappedBy = "favoriteSaleRequests")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private List<Employee> favoriteEmployees;

    @AuditedField(occasion = ON_UPDATE,
            template = "Название компании ${#company.id}: ${#company.name} изменено на "
                    + "${company.id}: ${company.name}",
            templateEn = "Company's ${#company.id}: ${#company.name} was changed to "
                    + "${company.id}: ${company.name}"
    )
    @ManyToOne
    @JoinColumn(name = "company_id", referencedColumnName = "id")
    private Company company;

    @PrePersist
    private void prePersist() {
        createDate = LocalDateTime.now();
    }

    @PreRemove
    private void preRemove() {
        favoriteEmployees.forEach(employee -> employee.getFavoriteSaleRequests().remove(this));
    }
}
