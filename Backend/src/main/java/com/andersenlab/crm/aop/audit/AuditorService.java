package com.andersenlab.crm.aop.audit;

import com.andersenlab.crm.exceptions.CrmException;
import com.andersenlab.crm.model.entities.History;
import com.andersenlab.crm.repositories.HistoryRepository;
import com.andersenlab.crm.security.AuthenticatedUser;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class AuditorService {

    private static final String NOT_AUDITED_ENTITY = "Not audited entity";

    private final AuthenticatedUser authenticatedUser;
    private final HistoryRepository historyRepository;

    public History createHistory(Object entity) {
        History history = HistoryFactory.getHistory(entity)
                .orElseThrow(() -> new CrmException(NOT_AUDITED_ENTITY));
        history.setEmployee(authenticatedUser.getCurrentEmployee());
        return history;
    }

    @Transactional
    public void saveHistory(History... history) {
        historyRepository.save(Arrays.asList(history));
    }
}
