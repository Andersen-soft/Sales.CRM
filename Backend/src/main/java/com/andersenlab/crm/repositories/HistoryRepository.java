package com.andersenlab.crm.repositories;

import com.andersenlab.crm.model.entities.History;
import com.andersenlab.crm.model.entities.QHistory;

/**
 * @author v.pronkin on 31.07.2018
 */
public interface HistoryRepository extends BaseRepository<QHistory, History, Long> {
}
