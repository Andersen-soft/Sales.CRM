package com.andersenlab.crm.rest.facade;

import com.andersenlab.crm.rest.DtoResponse;
import com.andersenlab.crm.rest.dto.SocialNetworkUserDto;
import com.querydsl.core.types.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SocialNetworkUserFacade {

    DtoResponse<SocialNetworkUserDto> create(SocialNetworkUserDto dto);

    SocialNetworkUserDto getById(Long id);

    Page<SocialNetworkUserDto> getAll(Predicate predicate, Pageable pageable);

    Page<String> getAllBySaleReport(Predicate predicate, Pageable pageable);

    void delete(Long id);

    SocialNetworkUserDto update(Long id, SocialNetworkUserDto dto);

}
