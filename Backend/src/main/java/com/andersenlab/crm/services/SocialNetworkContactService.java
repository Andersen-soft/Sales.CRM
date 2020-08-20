package com.andersenlab.crm.services;

import com.andersenlab.crm.model.entities.SocialNetworkContact;
import com.querydsl.core.types.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SocialNetworkContactService {

    SocialNetworkContact findSNContactByIdOrThrowException(Long id);

    boolean exist(Long id);

    SocialNetworkContact create(SocialNetworkContact contact);

    SocialNetworkContact update(SocialNetworkContact contact);

    SocialNetworkContact getById(Long id);

    Page<SocialNetworkContact> findAll(Predicate predicate, Pageable pageable);

    void delete(Long id);

    void validateById(Long id);
}
