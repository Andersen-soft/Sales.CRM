package com.andersenlab.crm.repositories;

import com.andersenlab.crm.model.entities.Rating;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RatingRepository extends JpaRepository<Rating, Long> {
}
