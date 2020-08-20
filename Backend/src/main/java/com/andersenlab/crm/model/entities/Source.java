package com.andersenlab.crm.model.entities;

import com.andersenlab.crm.model.Nameable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.ToString;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@RequiredArgsConstructor
@Table(name = "crm_source", uniqueConstraints = {@UniqueConstraint(columnNames = {"name"})})
public class Source {

    @Getter
    @AllArgsConstructor
    public enum Type implements Nameable {
        SOCIAL_NETWORK("Социальная сеть"),
        OTHER("Другое");

        private final String name;
    }
    
    @Id
    @GeneratedValue
    @NonNull
    private Long id;

    private String name;

    @Column(name = "name_en")
    private String nameEn;

    @Column(name = "description_ru")
    private String descriptionRu;

    @Column(name = "description_en")
    private String descriptionEn;

    @OneToMany(mappedBy = "source", fetch = FetchType.LAZY)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private List<CompanySale> companySales;

    @Enumerated(EnumType.STRING)
    private Type type;
}
