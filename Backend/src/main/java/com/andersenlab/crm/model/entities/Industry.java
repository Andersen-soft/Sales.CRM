package com.andersenlab.crm.model.entities;

import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "crm_industry")
public class Industry {

    @Id
    @GeneratedValue
    @NonNull
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(nullable = false, columnDefinition = "BIT")
    private Boolean common;

    @OneToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    private Employee employee;

    @Column(name = "create_date")
    private LocalDateTime createDate;
}
