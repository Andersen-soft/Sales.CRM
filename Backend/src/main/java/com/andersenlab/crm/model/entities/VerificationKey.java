package com.andersenlab.crm.model.entities;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;

/**
 * VerificationKey contains access token and external key, these one are generated temporary to change password.
 *
 * @author Roman_Haida
 * 24.07.2019
 */
@Entity
@Data
@NoArgsConstructor
@Accessors(chain = true)
@Table(name = "crm_verification_key")
public class VerificationKey {

    @Id
    @GeneratedValue
    private Long id;

    @Column
    @NotBlank
    private String tokenKey;

    @Column
    @NotBlank
    private String token;

    @Column
    private LocalDateTime createDate;

    @PrePersist
    private void prePersist() {
        this.createDate = LocalDateTime.now();
    }
}
