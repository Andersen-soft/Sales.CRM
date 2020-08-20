package com.andersenlab.crm.repositories;

import com.andersenlab.crm.model.entities.EstimationRequest;
import com.andersenlab.crm.model.entities.QEstimationRequest;
import org.springframework.data.querydsl.binding.QuerydslBindings;

/**
 * @author Yevhenii Pshenychnyi
 */
public interface EstimationRequestRepository extends BaseRepository<QEstimationRequest, EstimationRequest, Long> {

    long deleteById(Long id);

    @Override
    default void customize(QuerydslBindings bindings, QEstimationRequest root) {
        bindStringAndLong(bindings, root);

        bindings.bind(root.name).first((path, value) ->
                QEstimationRequest.estimationRequest.id.stringValue()
                        .concat(QEstimationRequest.estimationRequest.name)
                        .containsIgnoreCase(value)
        );

        //Added for accurate search by company.id (since the general search for Long is done by content)
        bindings.bind(root.company.id).first((path, value) -> {
            if (value == null) {
                return path.isNull();
            }
            return path.eq(value);
        });
    }

    EstimationRequest findByOldId(Long oldId);

    EstimationRequest findByIsActiveTrueAndId(Long id);

    boolean existsById(Long id);

    boolean existsByIsActiveTrueAndId(Long id);
}
