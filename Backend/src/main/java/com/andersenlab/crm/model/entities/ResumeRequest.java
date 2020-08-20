package com.andersenlab.crm.model.entities;

import com.andersenlab.crm.aop.audit.Audited;
import com.andersenlab.crm.aop.audit.AuditedField;
import com.andersenlab.crm.model.Nameable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

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
import java.util.ArrayList;
import java.util.List;

import static com.andersenlab.crm.aop.audit.Audited.Occasion.ON_CREATE;
import static com.andersenlab.crm.aop.audit.Audited.Occasion.ON_DELETE;
import static com.andersenlab.crm.aop.audit.AuditedField.Occasion.ON_UPDATE;
import static javax.persistence.CascadeType.PERSIST;

@Audited(
        occasion = ON_CREATE,
        template = "Запрос на резюме ${name} создан",
        templateEn = "Request for CV ${name} was created"
)
@Audited(
        pathToRoot = "companySale",
        occasion = ON_CREATE,
        template = "Был создан запрос на резюме ${name}",
        templateEn = "Request for CV ${name} was created"
)
@Audited(
        occasion = ON_DELETE,
        template = "Запрос на резюме ${name} удален",
        templateEn = "Request for CV ${name} was deleted"
)
@Entity
@Getter
@Setter
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@NoArgsConstructor
@Table(name = "crm_resume_request")
@SuppressWarnings("squid:S2160")
public class ResumeRequest extends SaleRequest implements Responsible {

    @Getter
    @AllArgsConstructor
    public enum Priority implements Nameable {
        MAJOR("Major"),
        CRITICAL("Critical");

        private final String name;

    }

    @Getter
    @AllArgsConstructor
    public enum Status implements Nameable {
        NAME_NEED("Name need"),
        HR_NEED("HR Need"),
        IN_PROGRESS("In progress"),
        CTO_NEED("CTO Need"),
        DONE("Done"),
        PENDING("Pending");

        private final String name;

    }

    @OneToMany(mappedBy = "resumeRequest", fetch = FetchType.LAZY)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private List<ResumeRequestHistory> requestResumeHistories;

    @OneToMany(mappedBy = "resumeRequest", fetch = FetchType.LAZY, cascade = PERSIST)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private List<ResumeRequestComment> comments;

    @AuditedField(
            onRootSubtype = ResumeRequest.class,
            occasion = ON_UPDATE,
            template = "Приоритет изменен с ${#priority.name} на ${priority.name}",
            templateEn = "Priority ${#priority.name} was changed to ${priority.name}"
    )
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Priority priority;

    @AuditedField(
            onRootSubtype = ResumeRequest.class,
            occasion = ON_UPDATE,
            template = "Статус запроса изменен с ${#status.name} на ${status.name}",
            templateEn = "Request status ${#status.name} was changed to ${status.name}"
    )
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Status status;

    @OneToMany(mappedBy = "resumeRequest", fetch = FetchType.EAGER)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private List<Resume> resumes = new ArrayList<>();

    @Column(name = "done_date")
    private LocalDateTime doneDate;

    @ManyToOne
    @JoinColumn(name = "company_sale_id", referencedColumnName = "id")
    private CompanySale companySale;

    @Column(name = "old_id")
    private Long oldId;

    @Column(name = "auto_distribution")
    private boolean autoDistribution;

    @Column
    private LocalDateTime statusChangedDate;

    public ResumeRequest(Long id) {
        super(id);
    }

    @Override
    public Employee getResponsible() {
        return getResponsibleForRequest();
    }

    @PrePersist
    private void localPrePersist() {
        setIsActive(true);
        status = Status.NAME_NEED;
        statusChangedDate = LocalDateTime.now();
    }

}
