package com.andersenlab.crm.aop.audit;

import com.andersenlab.crm.model.entities.Company;
import com.andersenlab.crm.model.entities.CompanyHistory;
import com.andersenlab.crm.model.entities.CompanySale;
import com.andersenlab.crm.model.entities.CompanySaleHistory;
import com.andersenlab.crm.model.entities.EstimationRequest;
import com.andersenlab.crm.model.entities.EstimationRequestHistory;
import com.andersenlab.crm.model.entities.History;
import com.andersenlab.crm.model.entities.Resume;
import com.andersenlab.crm.model.entities.ResumeHistory;
import com.andersenlab.crm.model.entities.ResumeRequest;
import com.andersenlab.crm.model.entities.ResumeRequestHistory;

import java.util.Optional;

class HistoryFactory {

    private HistoryFactory() {
    }

    static Optional<History> getHistory(Object entity) {
        History history = null;
        if (entity instanceof ResumeRequest) {
            history = new ResumeRequestHistory();
            ((ResumeRequestHistory) history).setResumeRequest((ResumeRequest) entity);
        }
        if (entity instanceof Resume) {
            history = new ResumeHistory();
            ((ResumeHistory) history).setResume((Resume) entity);
        }
        if (entity instanceof EstimationRequest) {
            history = new EstimationRequestHistory();
            ((EstimationRequestHistory) history).setEstimationRequest((EstimationRequest) entity);
        }
        if (entity instanceof Company) {
            history = new CompanyHistory();
            ((CompanyHistory) history).setCompany((Company) entity);
        }
        if (entity instanceof CompanySale) {
            history = new CompanySaleHistory();
            ((CompanySaleHistory) history).setCompanySale((CompanySale) entity);
        }

        return Optional.ofNullable(history);
    }
}
