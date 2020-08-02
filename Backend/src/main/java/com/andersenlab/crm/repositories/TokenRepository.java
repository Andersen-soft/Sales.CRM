package com.andersenlab.crm.repositories;

import com.andersenlab.crm.model.entities.Token;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

public interface TokenRepository extends JpaRepository<Token, Long> {

	Token findTokenByValue(String token);

	boolean existsByLogin(String login);

	Token findByLogin(String login);

	Integer deleteByCreateDateBefore(LocalDateTime dateTime);
}
