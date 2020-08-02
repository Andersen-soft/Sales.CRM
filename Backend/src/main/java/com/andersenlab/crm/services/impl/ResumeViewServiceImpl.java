package com.andersenlab.crm.services.impl;

import com.andersenlab.crm.model.view.ResumeView;
import com.andersenlab.crm.repositories.ResumeViewRepository;
import com.andersenlab.crm.services.ResumeViewService;
import com.querydsl.core.types.Predicate;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ResumeViewServiceImpl implements ResumeViewService {
    private final ResumeViewRepository resumeViewRepository;

    @Override
    public Page<ResumeView> get(Predicate predicate, Pageable pageable) {
        return resumeViewRepository.findAll(predicate, pageable);
    }

    @Override
    public ResumeView get(Long id) {
        return resumeViewRepository.findOne(id);
    }
}
