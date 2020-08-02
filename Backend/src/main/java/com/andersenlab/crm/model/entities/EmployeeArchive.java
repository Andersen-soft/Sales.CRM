package com.andersenlab.crm.model.entities;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "crm_employee_archive")
public class EmployeeArchive {
    @Id
    @GeneratedValue
    private Long id;

    @OneToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    private Employee employee;

    @Column
    private LocalDateTime date;
}
