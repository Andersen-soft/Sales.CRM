package com.andersenlab.crm.model.entities;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.Size;

@Data
@Entity
@NoArgsConstructor
@RequiredArgsConstructor
@Table(name = "crm_countries")
public class Country {
    @Id
    @NonNull
    private Long id;

    @Size(max = 75, min = 2)
    @Column(name = "name_ru",
            nullable = false,
            columnDefinition = "VARCHAR(75) default ''",
            length = 75)
    private String nameRu;

    @Column(name = "name_en")
    private String nameEn;

    @Size(max = 2, min = 2)
    @Column(name = "alpha_2", nullable = false, columnDefinition = "CHAR(2) default ''", length = 2)
    private String alpha2;

    @Size(max = 3, min = 3)
    @Column(name = "alpha_3", nullable = false, columnDefinition = "CHAR(3) default ''", length = 3)
    private String alpha3;
}
