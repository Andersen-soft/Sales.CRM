package com.andersenlab.crm.repositories;

import com.andersenlab.crm.model.entities.File;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * @author Yevhenii Muzyka on 03.08.2018
 */
public interface FileRepository extends JpaRepository<File, Long> {

    File findByKey(String key);

    Page<File> findAllBySaleRequestId(Pageable pageable, Long saleRequestId);
}
