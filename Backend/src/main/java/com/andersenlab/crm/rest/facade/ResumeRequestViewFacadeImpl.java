package com.andersenlab.crm.rest.facade;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.rest.dto.ResumeRequestViewDto;
import com.andersenlab.crm.services.ResumeRequestViewService;
import com.querydsl.core.types.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class ResumeRequestViewFacadeImpl implements ResumeRequestViewFacade {

    private final ResumeRequestViewService resumeRequestViewService;
    private final ConversionService conversionService;

    @Override
    public ResumeRequestViewDto get(Long id) {
        return conversionService.convert(resumeRequestViewService.get(id), ResumeRequestViewDto.class);
    }

    @Override
    public Page<ResumeRequestViewDto> get(Predicate predicate, Pageable pageable) {
        return conversionService.convertToPage(pageable,
                resumeRequestViewService.get(predicate, pageable),
                ResumeRequestViewDto.class);
    }

}
