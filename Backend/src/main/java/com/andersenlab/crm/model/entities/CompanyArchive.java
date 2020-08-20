package com.andersenlab.crm.model.entities;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "crm_company_archive")
public class CompanyArchive {

    @Id
    @GeneratedValue
    private Long id;

    @OneToOne
    @JoinColumn(name = "company_id", referencedColumnName = "id")
    private Company company;

    @Column
    private LocalDateTime dateTime;
}
