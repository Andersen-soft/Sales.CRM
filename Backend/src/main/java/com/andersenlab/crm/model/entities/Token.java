package com.andersenlab.crm.model.entities;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@RequiredArgsConstructor
@Table(name = "crm_token")
public class Token {

    @Id
    @GeneratedValue
    private Long id;

    @Column
    @NonNull
    private String login;

    @Column
    @NonNull
    private String value;

    @Column
    private LocalDateTime createDate;

    @PrePersist
    private void prePersist(){
        createDate = LocalDateTime.now();
    }
}
