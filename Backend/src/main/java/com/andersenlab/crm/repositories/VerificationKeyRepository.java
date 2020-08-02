package com.andersenlab.crm.repositories;

import com.andersenlab.crm.model.entities.VerificationKey;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * VerificationKeyRepository.
 *
 * @author Roman_Haida
 * 24.07.2019
 */
public interface VerificationKeyRepository extends JpaRepository<VerificationKey, Long> {

    Optional<VerificationKey> findByTokenKey(String tokenKey);

    Integer deleteByCreateDateBefore(LocalDateTime dateTime);
}
