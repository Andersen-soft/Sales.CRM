package com.andersenlab.crm.services;

import com.andersenlab.crm.model.view.ResumeView;
import com.querydsl.core.types.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ResumeViewService {
    Page<ResumeView> get(Predicate predicate, Pageable pageable);

    ResumeView get(Long id);
}
