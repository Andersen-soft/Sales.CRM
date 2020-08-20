package com.andersenlab.crm.model.entities;

import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "crm_resume_status_history")
public class ResumeStatusHistory {

  @Id
  @GeneratedValue
  @NonNull
  private Long id;

  @ManyToOne
  @JoinColumn(name = "resume_id", referencedColumnName = "id")
  private Resume resume;

  @Column(name = "status_duration")
  private Long statusDuration;

  @Column(name = "status_started")
  private LocalDateTime statusStarted;

  @Column(name = "status_name")
  private String statusName;

}

