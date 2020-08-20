package com.andersenlab.crm.model.entities;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.PrePersist;
import javax.persistence.Table;
import java.time.LocalDateTime;
import java.util.List;

/**
 * @author v.pronkin on 10.08.2018
 */
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Getter
@Setter
@Table(name = "crm_sale_object")
public class SaleObject {

    @Id
    @GeneratedValue
    private Long id;

    @Column
    private LocalDateTime createDate;

    @OneToMany(mappedBy = "saleObject", cascade = CascadeType.MERGE)
    private List<File> files;

    @Column
    private Boolean isActive;

    @ManyToOne
    @JoinColumn(name = "author_id", referencedColumnName = "id")
    private Employee author;

    @PrePersist
    private void prePersist() {
        createDate = LocalDateTime.now();
        isActive = true;
    }
}
