package com.andersenlab.crm.services;

import com.andersenlab.crm.model.entities.SocialNetworkUser;
import com.querydsl.core.types.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface SocialNetworkUserService {

    SocialNetworkUser createOrUpdate(SocialNetworkUser socialNetworkUser);

    Page<SocialNetworkUser> findAll(Predicate predicate, Pageable pageable);

    List<String> findAllBySaleReport(Predicate predicate, Pageable pageable);

    SocialNetworkUser findById(Long id);

    void delete(Long id);

    boolean exist(Long id);

    SocialNetworkUser findByIdOrThrowException(Long id);

    void validateById(Long id);
}