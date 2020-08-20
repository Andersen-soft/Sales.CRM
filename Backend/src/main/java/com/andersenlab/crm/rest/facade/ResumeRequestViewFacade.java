package com.andersenlab.crm.rest.facade;

import com.andersenlab.crm.rest.dto.ResumeRequestViewDto;
import com.querydsl.core.types.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ResumeRequestViewFacade {
    ResumeRequestViewDto get(Long id);

    Page<ResumeRequestViewDto> get(Predicate predicate, Pageable pageable);
}
