package com.andersenlab.crm.model.entities;

import com.andersenlab.crm.aop.audit.Audited;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import static com.andersenlab.crm.aop.audit.Audited.Occasion.ON_CREATE;
import static com.andersenlab.crm.aop.audit.Audited.Occasion.ON_DELETE;

@Audited(
        pathToRoot = "estimationRequest",
        occasion = ON_CREATE,
        template = "Комментарий добавлен",
        templateEn = "Comment was added"
)
@Audited(
        pathToRoot = "estimationRequest",
        occasion = ON_DELETE,
        template = "Комментарий удален",
        templateEn = "Comment was deleted"
)
@Entity
@Getter
@Setter
@Table(name = "crm_estimation_request_comment")
public class EstimationRequestComment extends Comment {

    @ManyToOne
    @JoinColumn(name = "estimation_request_id", referencedColumnName = "id")
    private EstimationRequest estimationRequest;
}
