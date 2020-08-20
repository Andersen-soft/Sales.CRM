package com.andersenlab.crm.model.entities;

import com.andersenlab.crm.aop.audit.Audited;
import com.andersenlab.crm.aop.audit.AuditedField;
import com.andersenlab.crm.model.Nameable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Type;

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
import java.util.List;

import static com.andersenlab.crm.aop.audit.Audited.Occasion.ON_CREATE;
import static com.andersenlab.crm.aop.audit.Audited.Occasion.ON_DELETE;
import static com.andersenlab.crm.aop.audit.AuditedField.Occasion.ON_SET;
import static com.andersenlab.crm.aop.audit.AuditedField.Occasion.ON_UNSET;
import static com.andersenlab.crm.aop.audit.AuditedField.Occasion.ON_UPDATE;

@Audited(
        pathToRoot = "resumeRequest",
        occasion = ON_CREATE,
        template = "Резюме ${fio} создано в статусе ${status.name}",
        templateEn = "CV ${fio} was created with status ${status.name}"
)
@Audited(
        pathToRoot = "resumeRequest",
        occasion = ON_DELETE,
        template = "Резюме ${fio} удалено",
        templateEn = "CV ${fio} was deleted"
)
@Entity
@Getter
@Setter
@Table(name = "crm_resume")
public class Resume extends SaleObject {
    @AuditedField(
            pathToRoot = "resumeRequest",
            occasion = ON_UPDATE,
            template = "Статус резюме ${fio} изменен с ${#status.name} на ${status.name}",
            templateEn = "CV's status ${fio} ${#status.name} was changed to ${status.name}"
    )
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Status status;

    @AuditedField(
            pathToRoot = "resumeRequest",
            occasion = ON_UPDATE,
            template = "ФИО изменено с ${#fio} на ${fio}",
            templateEn = "Full name ${#fio} was changed to ${fio}"
    )
    @Column
    private String fio;

    @Getter
    @AllArgsConstructor
    public enum Status implements Nameable {
        HR_NEED("HR Need"),
        IN_PROGRESS("In progress"),
        CTO_NEED("CTO Need"),
        DONE("Done"),
        PENDING("Pending");

        private final String name;
    }

    @ManyToOne
    @JoinColumn(name = "resume_request_id", referencedColumnName = "id")
    private ResumeRequest resumeRequest;

    @OneToMany(mappedBy = "resume", fetch = FetchType.LAZY)
    private List<ResumeHistory> histories;

    @AuditedField(
            pathToRoot = "resumeRequest",
            occasion = ON_UPDATE,
            template = "Ответственный HR кандидата ${fio} изменен с ${#responsibleHr.firstName} ${#responsibleHr.lastName} на ${responsibleHr.firstName} ${responsibleHr.lastName}",
            templateEn = "Responsible HR for CV ${fio} was changed from ${#responsibleHr.firstName} ${#responsibleHr.lastName} to ${responsibleHr.firstName} ${responsibleHr.lastName}")
    @AuditedField(
            pathToRoot = "resumeRequest",
            occasion = ON_SET,
            template = "Отвественный HR кандидата ${fio} установлен ${responsibleHr.firstName} ${responsibleHr.lastName}",
            templateEn = "${responsibleHr.firstName} ${responsibleHr.lastName} was set as responsible HR of applicant ${fio}")
    @AuditedField(
            pathToRoot = "resumeRequest",
            occasion = ON_UNSET,
            template = "Ответственный HR ${#responsibleHr.firstName} ${#responsibleHr.lastName} был удален для кандидата ${fio}",
            templateEn = "Responsible HR ${#responsibleHr.firstName} ${#responsibleHr.lastName} was deleted for applicant ${fio}")
    @ManyToOne
    @JoinColumn(name = "responsible_hr_id", referencedColumnName = "id")
    private Employee responsibleHr;

    @Column
    private Long returnsResumeCount;

    @Column
    private LocalDateTime statusChangedDate;

    @Column
    @Type(type = "text")
    private String hrComment;

    @Column
    private Boolean isUrgent;

    @PrePersist
    private void localPrePersist() {
        returnsResumeCount = 0L;
        statusChangedDate = LocalDateTime.now();
        isUrgent = false;
    }
}
