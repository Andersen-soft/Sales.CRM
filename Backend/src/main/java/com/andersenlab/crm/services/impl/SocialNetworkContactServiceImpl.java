package com.andersenlab.crm.services.impl;

import com.andersenlab.crm.exceptions.CrmException;
import com.andersenlab.crm.model.entities.SocialNetworkContact;
import com.andersenlab.crm.repositories.SocialNetworkContactRepository;
import com.andersenlab.crm.security.AuthenticatedUser;
import com.andersenlab.crm.services.SocialNetworkContactService;
import com.querydsl.core.types.Predicate;
import lombok.AllArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.util.Optional;

@Service
@AllArgsConstructor
public class SocialNetworkContactServiceImpl implements SocialNetworkContactService {

    private final SocialNetworkContactRepository socialNetworkContactRepository;
    private final AuthenticatedUser authenticatedUser;

    public SocialNetworkContact findSNContactByIdOrThrowException(Long id) {
        return Optional.ofNullable(socialNetworkContactRepository.findOne(id))
                .orElseThrow(() -> new CrmException("Контакт соцсети не найден"));
    }

    @Override
    public boolean exist(Long id) {
        return socialNetworkContactRepository.exists(id);
    }

    @Override
    public SocialNetworkContact create(SocialNetworkContact contact) {
        try {
            return socialNetworkContactRepository.save(contact);
        } catch (DataIntegrityViolationException e) {
            throw new IllegalArgumentException(e.getMostSpecificCause().getMessage(), e);
        }
    }

    @Override
    public SocialNetworkContact update(SocialNetworkContact contact) {
        return socialNetworkContactRepository.save(contact);
    }

    @Override
    public SocialNetworkContact getById(Long id) {
        return findSNContactByIdOrThrowException(id);
    }

    @Override
    public Page<SocialNetworkContact> findAll(Predicate predicate, Pageable pageable) {
        return socialNetworkContactRepository.findAll(predicate, pageable);
    }

    @Override
    public void delete(Long id) {
        socialNetworkContactRepository.delete(id);
    }

    @Override
    public void validateById(Long id) {
        if (!socialNetworkContactRepository.exists(id)) {
            throw new EntityNotFoundException("Social network contact not found: " + id);
        }
    }
}
