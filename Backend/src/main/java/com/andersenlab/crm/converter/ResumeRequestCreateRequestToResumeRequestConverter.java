package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.entities.Company;
import com.andersenlab.crm.model.entities.ResumeRequest;
import com.andersenlab.crm.model.entities.ResumeRequestComment;
import com.andersenlab.crm.rest.request.ResumeRequestCreateRequest;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static com.andersenlab.crm.utils.ConverterHelper.getNullable;
import static com.andersenlab.crm.utils.CrmStringUtils.fixStringDescription;
import static com.andersenlab.crm.utils.ServiceUtils.getByNameOrThrow;

/**
 * Provides type conversion ResumeRequestCreateRequest-to-ResumeRequest.
 */
@Component
public class ResumeRequestCreateRequestToResumeRequestConverter
        implements Converter<ResumeRequestCreateRequest, ResumeRequest> {

    @Override
    public ResumeRequest convert(ResumeRequestCreateRequest source) {
        ResumeRequest target = new ResumeRequest();
        target.setName(source.getName());
        Optional.ofNullable(source.getDeadline()).ifPresent(date -> target.setDeadline(LocalDateTime.of(source.getDeadline(), LocalTime.MIN)));
        target.setPriority(getNullable(source.getPriority(), s -> getByNameOrThrow(ResumeRequest.Priority.class, s)));
        target.setCompany(new Company(source.getCompanyId()));
        target.setComments(defineComment(source));
        return target;
    }

    @Override
    public Class<ResumeRequestCreateRequest> getSource() {
        return ResumeRequestCreateRequest.class;
    }

    @Override
    public Class<ResumeRequest> getTarget() {
        return ResumeRequest.class;
    }

    private List<ResumeRequestComment> defineComment(ResumeRequestCreateRequest source) {
        if (source.getComment() == null) {
            return new ArrayList<>();
        }
        ResumeRequestComment resumeRequestComment = new ResumeRequestComment();
        resumeRequestComment.setDescription(fixStringDescription(source.getComment()));
        return Collections.singletonList(resumeRequestComment);
    }
}
