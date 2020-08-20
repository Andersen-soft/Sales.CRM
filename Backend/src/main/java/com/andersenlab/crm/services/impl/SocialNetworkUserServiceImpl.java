package com.andersenlab.crm.services.impl;

import com.andersenlab.crm.exceptions.CrmException;
import com.andersenlab.crm.model.entities.SocialNetworkUser;
import com.andersenlab.crm.model.view.SaleReport;
import com.andersenlab.crm.repositories.ReportRepository;
import com.andersenlab.crm.repositories.SocialNetworkUserRepository;
import com.andersenlab.crm.services.SocialNetworkUserService;
import com.querydsl.core.types.Predicate;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
@AllArgsConstructor
public class SocialNetworkUserServiceImpl implements SocialNetworkUserService {

    private final SocialNetworkUserRepository socialNetworkUserRepository;
    private final ReportRepository reportRepository;

    @Override
    public SocialNetworkUser createOrUpdate(SocialNetworkUser socialNetworkUser) {
        return socialNetworkUserRepository.save(socialNetworkUser);
    }

    @Override
    public Page<SocialNetworkUser> findAll(Predicate predicate, Pageable pageable) {
        return socialNetworkUserRepository.findAll(predicate, pageable);
    }

    @Override
    public List<String> findAllBySaleReport(Predicate predicate, Pageable pageable) {
        return StreamSupport
                .stream(reportRepository.findAll(predicate, pageable.getSort()).spliterator(), false)
                .map(SaleReport::getSocialContactName)
                .distinct()
                .collect(Collectors.toList());
    }

    @Override
    public SocialNetworkUser findById(Long id) {
        return socialNetworkUserRepository.getOne(id);
    }

    @Override
    public void delete(Long id) {
        socialNetworkUserRepository.delete(id);
    }

    @Override
    public boolean exist(Long id) {
        return socialNetworkUserRepository.exists(id);
    }

    @Override
    public SocialNetworkUser findByIdOrThrowException(Long id) {
        return Optional.ofNullable(socialNetworkUserRepository.findOne(id))
                .orElseThrow(() -> new CrmException("Пользователь соцсети не найден"));
    }

    @Override
    public void validateById(Long id) {
        if (!socialNetworkUserRepository.exists(id)) {
            throw new EntityNotFoundException("Social network contact not found: " + id);
        }
    }
}
