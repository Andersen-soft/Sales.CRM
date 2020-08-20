package com.andersenlab.crm.model.entities;

import com.andersenlab.crm.model.Nameable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import org.hibernate.annotations.Formula;
import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.Subselect;

import javax.persistence.*;
import java.time.LocalDateTime;

import static com.andersenlab.crm.model.entities.SqlConstants.FAVORITE_SALE_REQUESTS;
import static com.andersenlab.crm.model.entities.SqlConstants.RESUME_REQUEST_VIEW;

@Data
@Entity
@Immutable
@Subselect(RESUME_REQUEST_VIEW)
public class ResumeRequestView {
    @Id
    private Long id;

    @AllArgsConstructor
    @Getter
    public enum BoardStatus implements Nameable {
        HR_NEED("hr need"),
        IN_PROGRESS("in progress"),
        DONE("done");

        private final String name;
    }

    @ManyToOne
    @JoinColumn(name = "request_id")
    private ResumeRequest resumeRequest;

    @Enumerated(EnumType.STRING)
    private BoardStatus status;

    @Formula(FAVORITE_SALE_REQUESTS)
    private Boolean isFavorite;

    @Column(name = "is_active")
    private Boolean isActive;

    @Enumerated(EnumType.STRING)
    private ResumeRequest.Priority priority;

    @Column(name = "create_date")
    private LocalDateTime createDate;

    @Column(name = "done_date")
    private LocalDateTime doneDate;
}
