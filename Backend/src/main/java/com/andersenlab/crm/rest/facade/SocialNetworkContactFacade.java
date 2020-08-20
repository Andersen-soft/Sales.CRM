package com.andersenlab.crm.rest.facade;

import com.andersenlab.crm.rest.DtoResponse;
import com.andersenlab.crm.rest.dto.SocialNetworkContactDto;
import com.andersenlab.crm.rest.response.SourceDto;
import com.querydsl.core.types.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Locale;

public interface SocialNetworkContactFacade {

    DtoResponse<SocialNetworkContactDto> create(SocialNetworkContactDto request);

    SocialNetworkContactDto getById(Long id);

    Page<SocialNetworkContactDto> getAll(Predicate predicate, Pageable pageable);

    Page<SocialNetworkContactDto> getAll(Predicate predicate, Pageable pageable, Locale locale);

    void delete(Long id);

    SocialNetworkContactDto update(Long id, SocialNetworkContactDto dto);

    List<SourceDto> getSocialNetworkSources();
}
