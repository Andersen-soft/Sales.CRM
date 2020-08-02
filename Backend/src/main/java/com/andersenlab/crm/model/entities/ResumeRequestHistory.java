package com.andersenlab.crm.model.entities;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Getter
@Setter
@Table(name = "crm_resume_request_history")
public class ResumeRequestHistory extends History {

    @ManyToOne
    @JoinColumn(name = "resume_request_id", referencedColumnName = "id")
    private ResumeRequest resumeRequest;
}
