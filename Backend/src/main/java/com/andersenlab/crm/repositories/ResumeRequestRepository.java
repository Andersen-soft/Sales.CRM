package com.andersenlab.crm.repositories;

import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.model.entities.QResumeRequest;
import com.andersenlab.crm.model.entities.ResumeRequest;
import org.springframework.data.querydsl.binding.QuerydslBindings;

import java.time.LocalDateTime;
import java.util.Iterator;
import java.util.List;

public interface ResumeRequestRepository extends BaseRepository<QResumeRequest, ResumeRequest, Long> {

    @Override
    default void customize(QuerydslBindings bindings, QResumeRequest root) {
        bindStringAndLong(bindings, root);

        bindings.bind(root.deadline).all((path, value) -> {
            Iterator<? extends LocalDateTime> iterator = value.iterator();
            return path.between(iterator.next(), iterator.next());
        });

        bindings.bind(root.companySale).first((path, value) -> {
            if (value == null) {
                return path.isNull();
            }
            return path.eq(value);
        });

        //Added for accurate search by company.id (since the general search for Long is done by content)
        bindings.bind(root.company.id).first((path, value) -> {
            if (value == null) {
                return path.isNull();
            }
            return path.eq(value);
        });
    }

    ResumeRequest findByOldId(Long oldId);

    boolean existsById(Long id);

    ResumeRequest findByIsActiveIsTrueAndId(Long id);

    List<ResumeRequest> findAllByStatusAndIsActiveAndAutoDistribution(ResumeRequest.Status status, boolean isActive, boolean autoDistribution);

    List<ResumeRequest> findAllByStatusAndIsActiveAndResponsibleRMAndAutoDistribution(ResumeRequest.Status status, boolean isActive, Employee employee, boolean autoDistribution);
}
