package com.andersenlab.crm.model.entities;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "crm_company_sale_archive")
public class CompanySaleArchive {

    @Id
    @GeneratedValue
    private Long id;

    @OneToOne
    @JoinColumn(name = "company_sale_id", referencedColumnName = "id")
    private CompanySale companySale;

    @Column
    private LocalDateTime dateTime;

    @PrePersist
    private void prePersist() {
        dateTime = LocalDateTime.now();
    }
}
