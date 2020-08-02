package com.andersenlab.crm.model.entities;

import com.andersenlab.crm.aop.audit.Audited;
import com.andersenlab.crm.aop.audit.AuditedField;
import com.andersenlab.crm.model.Nameable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.Formula;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.PrePersist;
import javax.persistence.Table;
import java.time.LocalDateTime;
import java.util.LinkedList;
import java.util.List;

import static com.andersenlab.crm.aop.audit.Audited.Occasion.ON_CREATE;
import static com.andersenlab.crm.aop.audit.Audited.Occasion.ON_DELETE;
import static com.andersenlab.crm.aop.audit.AuditedField.Occasion.ON_UPDATE;
import static com.andersenlab.crm.model.entities.SqlConstants.LAST_ACTIVITY_ESTIMATION;

@Audited(occasion = ON_CREATE,
        template = "Запрос на оценку ${name} создан",
        templateEn = "Request for estimation ${name} was created"
)
@Audited(
        pathToRoot = "companySale",
        occasion = ON_CREATE,
        template = "Был создан запрос на оценку ${name}",
        templateEn = "Request for estimation ${name} was created"
)
@Audited(
        occasion = ON_DELETE,
        template = "Запрос на оценку ${name} удален",
        templateEn = "Request for estimation ${name} was deleted"
)
@Entity
@Getter
@Setter
@ToString(callSuper = true)
@NoArgsConstructor
@Table(name = "crm_estimation_request")
@SuppressWarnings("squid:S2160")
public class EstimationRequest extends SaleRequest {
    @Getter
    @AllArgsConstructor
    public enum Status implements Nameable {
        ESTIMATION_NEED("Estimation need"),
        IN_PROGRESS("In progress"),
        APPROVE_NEED("Approve need"),
        DONE("Done"),
        PENDING("Pending");

        private final String name;
    }

    @OneToMany(mappedBy = "estimationRequest", cascade = CascadeType.MERGE, fetch = FetchType.LAZY)
    @ToString.Exclude
    private List<EstimationRequestComment> comments = new LinkedList<>();

    @OneToMany(mappedBy = "estimationRequest", fetch = FetchType.LAZY)
    @ToString.Exclude
    private List<EstimationRequestHistory> histories;

    @AuditedField(occasion = ON_UPDATE,
            template = "Статус запроса изменен с ${#status} на ${status}",
            templateEn = "Request status ${#status} was changed to ${status}"
    )
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Status status;

    @OneToMany(mappedBy = "estimation", fetch = FetchType.LAZY)
    @ToString.Exclude
    private List<File> estimations;

    @ManyToOne
    @JoinColumn(name = "company_sale_id", referencedColumnName = "id")
    private CompanySale companySale;

    @Column
    private Long oldId;

    @Column
    private LocalDateTime statusChangedDate;

    @Formula(LAST_ACTIVITY_ESTIMATION)
    private LocalDateTime lastActiveDate;

    @PrePersist
    private void init(){
        this.statusChangedDate = LocalDateTime.now();
        this.status = Status.ESTIMATION_NEED;
    }
}
