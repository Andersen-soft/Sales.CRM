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
@Table(name = "crm_resume_history")
public class ResumeHistory extends History {

    @ManyToOne
    @JoinColumn(name = "resume_id", referencedColumnName = "id")
    private Resume resume;
}
