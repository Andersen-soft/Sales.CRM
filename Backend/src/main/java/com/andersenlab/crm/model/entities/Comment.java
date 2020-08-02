package com.andersenlab.crm.model.entities;

import com.andersenlab.crm.aop.audit.AuditedField;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;
import java.time.LocalDateTime;

import static com.andersenlab.crm.aop.audit.AuditedField.Occasion.ON_UPDATE;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Getter
@Setter
@Table(name = "crm_comment")
public class Comment {

    @Id
    @GeneratedValue
    private Long id;

    @AuditedField(
            pathToRoot = "resumeRequest",
            occasion = ON_UPDATE,
            template = "Комментарий был изменен",
            templateEn = "Comment was edited"
    )
    @AuditedField(
            pathToRoot = "estimationRequest",
            occasion = ON_UPDATE,
            template = "Комментарий был изменен",
            templateEn = "Comment was edited"
    )
    @Column(columnDefinition = "TEXT")
    private String description;

    @Column
    private LocalDateTime createDate;

    @Column
    private LocalDateTime editDate;

    @Column(columnDefinition = "BIT")
    private Boolean isEdited;

    @ManyToOne
    @JoinColumn(name = "id_employee", referencedColumnName = "id")
    private Employee employee;

    @PrePersist
    private void prePersist() {
        createDate = LocalDateTime.now();
        isEdited = false;
    }

    @PreUpdate
    private void preUpdate() {
        editDate = LocalDateTime.now();
        isEdited = true;
    }
}
