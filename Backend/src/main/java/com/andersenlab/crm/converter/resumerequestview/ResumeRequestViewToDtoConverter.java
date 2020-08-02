package com.andersenlab.crm.converter.resumerequestview;

import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.entities.ResumeRequest;
import com.andersenlab.crm.model.view.AllResumeRequestsView;
import com.andersenlab.crm.rest.dto.ResumeRequestViewDto;
import com.andersenlab.crm.utils.CrmReportUtils;
import org.springframework.stereotype.Component;

import java.util.Locale;

import static com.andersenlab.crm.utils.ConverterHelper.getEmptyIfNull;
import static com.andersenlab.crm.utils.ConverterHelper.getNullable;
import static com.andersenlab.crm.utils.CrmReportUtils.*;

@Component
public class ResumeRequestViewToDtoConverter implements Converter<AllResumeRequestsView, ResumeRequestViewDto> {
    @Override
    public ResumeRequestViewDto convert(AllResumeRequestsView source) {
        ResumeRequestViewDto target = new ResumeRequestViewDto();
        target.setResumeRequestId(source.getResumeRequestId());
        target.setName(String.format("%d - %s", source.getResumeRequestId(), source.getName()));
        target.setCompanyName(CrmReportUtils.replaceNullField(source.getCompanyName()));
        target.setStatus(getNullable(source.getStatus(), ResumeRequest.Status::getName));
        target.setReturnsResumeCount(source.getReturnsResumeCount());
        target.setDeadline(source.getDeadline());
        target.setStringDeadline(getEmptyIfNull(source.getDeadline(), localDateTime -> localDateTime.format(CrmReportUtils.DATE_FORMATTER)));
        target.setResponsible(CrmReportUtils.replaceNullField(source.getResponsible()));
        target.setResponsibleId(source.getResponsibleId());
        target.setCreateDate(source.getCreateDate());
        target.setStringCreateDate(getEmptyIfNull(source.getCreateDate(), localDateTime -> localDateTime.format(CrmReportUtils.DATE_FORMATTER)));
        target.setResponsibleForSaleRequestName(CrmReportUtils.replaceNullField(source.getResponsibleForSaleRequestName()));
        target.setResponsibleForSaleRequestId(source.getResponsibleForSaleRequestId());
        target.setCountResume(source.getCountResume());
        target.setCompanySaleId(source.getCompanySaleId());
        target.setCompanySaleLink(getCompanySaleLink(source.getCompanySaleId()));
        target.setIsActive(source.getIsActive());
        return target;
    }

    private String getCompanySaleLink(Long saleId) {
        String companySaleId = replaceNullField(saleId);
        return  companySaleId.isEmpty() ? companySaleId : composeHyperlinkForLocale(companySaleId, "/sales/{id}", Locale.ENGLISH);
    }

    @Override
    public Class<AllResumeRequestsView> getSource() {
        return AllResumeRequestsView.class;
    }

    @Override
    public Class<ResumeRequestViewDto> getTarget() {
        return ResumeRequestViewDto.class;
    }
}
