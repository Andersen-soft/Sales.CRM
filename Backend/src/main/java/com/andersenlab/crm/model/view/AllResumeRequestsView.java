package com.andersenlab.crm.model.view;

import com.andersenlab.crm.model.entities.ResumeRequest;
import lombok.Data;
import org.hibernate.annotations.Immutable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity(name = "crm_resume_request_view")
@Immutable
public class AllResumeRequestsView {
    @Id
    private Long resumeRequestId;
    private String name;
    private Long companyId;
    private String companyName;
    @Enumerated(EnumType.STRING)
    private ResumeRequest.Status status;
    private BigDecimal returnsResumeCount;
    private LocalDateTime deadline;
    private Long responsibleId;
    private String responsible;
    private LocalDateTime createDate;
    private Long responsibleForSaleRequestId;
    private String responsibleForSaleRequestName;
    private Long countResume;
    private Long companySaleId;
    @Column(nullable = false, columnDefinition = "BIT")
    private Boolean isActive;
    private LocalDateTime lastActiveDate;
}
