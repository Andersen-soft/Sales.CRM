package com.andersenlab.crm.model.view;

import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.model.entities.Resume;
import com.andersenlab.crm.model.entities.ResumeRequest;
import lombok.Data;
import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.Type;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.persistence.JoinColumn;
import javax.persistence.Column;
import javax.persistence.Enumerated;
import javax.persistence.EnumType;

import java.time.LocalDateTime;

@Data
@Entity(name = "crm_resume_view")
@Immutable
public class ResumeView {
    @Id
    private Long id;
    private LocalDateTime createDate;
    private LocalDateTime deadline;
    @OneToOne
    @JoinColumn(name = "resume_request_id", referencedColumnName = "id")
    private ResumeRequest resumeRequest;
    private String fio;
    @Enumerated(EnumType.STRING)
    private Resume.Status status;
    @OneToOne
    @JoinColumn(name = "responsible_hr_id", referencedColumnName = "id")
    private Employee responsibleHr;
    @Column
    @Type(type="text")
    private String comment;
    @Column(name = "is_urgent")
    private boolean isUrgent;
}
