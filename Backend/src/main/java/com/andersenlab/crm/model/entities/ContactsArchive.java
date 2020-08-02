package com.andersenlab.crm.model.entities;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "crm_contacts_archive")
public class ContactsArchive {

    @Id
    @GeneratedValue
    private Long id;

    @OneToOne
    @JoinColumn(name = "contact_id", referencedColumnName = "id")
    private Contact contact;

    @Column
    private LocalDateTime date;
}
