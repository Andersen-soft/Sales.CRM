package com.andersenlab.crm.model.entities;

import com.andersenlab.crm.aop.audit.Audited;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import java.time.LocalDateTime;

import static com.andersenlab.crm.aop.audit.Audited.Occasion.ON_CREATE;
import static com.andersenlab.crm.aop.audit.Audited.Occasion.ON_DELETE;

@Audited(
        pathToRoot = "saleObject.estimationRequest",
        occasion = ON_CREATE,
        template = "Файл ${name} добавлен в Оценки",
        templateEn = "File ${name} was added to Estimations"
)
@Audited(
        pathToRoot = "saleObject.estimationRequest",
        occasion = ON_DELETE,
        template = "Файл ${name} удален из Оценок",
        templateEn = "File ${name} was deleted from Estimations"
)
@Audited(
        pathToRoot = "saleObject.resumeRequest",
        occasion = ON_CREATE,
        template = "Файл ${name} добавлен в резюме ${saleObject.fio}",
        templateEn = "File ${name} was added to CV ${saleObject.fio}"
)
@Audited(
        pathToRoot = "saleObject.resumeRequest",
        occasion = ON_DELETE,
        template = "Файл ${name} удален из резюме ${saleObject.fio}",
        templateEn = "File ${name} was deleted from CV ${saleObject.fio}"
)
@Audited(
        pathToRoot = "saleRequest",
        occasion = ON_CREATE,
        template = "Файл ${name} добавлен во Вложения",
        templateEn = "File ${name} was added to Attachments"
)
@Audited(
        pathToRoot = "saleRequest",
        occasion = ON_DELETE,
        template = "Файл ${name} удален из Вложений",
        templateEn = "File ${name} was deleted from Attachments"
)
@Audited(
        pathToRoot = "estimation",
        occasion = ON_CREATE,
        template = "Файл ${name} добавлен в Оценки",
        templateEn = "File ${name} was added to Estimations"
)
@Audited(
        pathToRoot = "estimation",
        occasion = ON_DELETE,
        template = "Файл ${name} удален из Оценок",
        templateEn = "File ${name} was deleted from Estimations"
)
@Entity
@Getter
@Setter
@Table(name = "crm_file")
public class File {

    @Id
    @GeneratedValue
    private Long id;

    @Column
    private Long oldId;

    @Column
    private String name;

    @Column(name = "file_key")
    private String key;

    @Column(name = "creation_date")
    private LocalDateTime creationDate;

    @Column(columnDefinition = "TEXT")
    private String comments;

    @ManyToOne
    @JoinColumn(name = "uploaded_by_id", referencedColumnName = "id")
    private Employee uploadedBy;

    @ManyToOne
    @JoinColumn(name = "sale_request_id", referencedColumnName = "id")
    private SaleRequest saleRequest;

    @ManyToOne
    @JoinColumn(name = "sale_object_id", referencedColumnName = "id")
    private SaleObject saleObject;

    @OneToOne
    @JoinColumn(name = "estimation_id", referencedColumnName = "id")
    private SaleRequest estimation;

}
