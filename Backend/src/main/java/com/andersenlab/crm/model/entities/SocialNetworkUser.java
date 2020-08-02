package com.andersenlab.crm.model.entities;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.PrePersist;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@RequiredArgsConstructor
@Table(name = "crm_social_network_user", uniqueConstraints = {@UniqueConstraint(columnNames = {"name"})})
public class SocialNetworkUser {

    @Id
    @GeneratedValue
    @NonNull
    private Long id;

    @Column
    private String name;

    @Column(name = "create_date")
    private LocalDateTime createDate;

    @OneToMany(mappedBy = "socialNetworkUser")
    private List<Contact> contacts;

    @PrePersist
    private void prePersist() {
        createDate = LocalDateTime.now();
    }

}
