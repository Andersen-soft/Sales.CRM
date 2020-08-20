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
@Table(name = "crm_company_sale_history")
public class CompanySaleHistory extends History {

    @ManyToOne
    @JoinColumn(name = "company_sale_id", referencedColumnName = "id")
    private CompanySale companySale;
}
