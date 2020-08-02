package com.andersenlab.crm.model.entities;

import com.andersenlab.crm.aop.audit.Audited;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import static com.andersenlab.crm.aop.audit.Audited.Occasion.ON_CREATE;

@Audited(
        pathToRoot = "resume.resumeRequest",
        occasion = ON_CREATE,
        template = "Комментарий добавлен с темой ${resume.fio}",
        templateEn = "Comment was added with the subject line ${resume.fio}"
)
@Entity
@Getter
@Setter
@Table(name = "crm_resume_comment")
public class ResumeComment extends Comment {

    @ManyToOne
    @JoinColumn(name = "resume_id", referencedColumnName = "id")
    private Resume resume;
}
