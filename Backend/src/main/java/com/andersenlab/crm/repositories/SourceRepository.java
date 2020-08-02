package com.andersenlab.crm.repositories;

import com.andersenlab.crm.model.entities.QSource;
import com.andersenlab.crm.model.entities.Source;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SourceRepository extends BaseRepository<QSource, Source, Long> {

  Source findByNameEn(String nameEn);

    @Query(value = "select s from Source s where lower(s.name) = lower(:name) or lower(s.nameEn) = lower(:name)")
    Source findSourceByNameEqualsIgnoreCase(@Param("name") String name);
}
