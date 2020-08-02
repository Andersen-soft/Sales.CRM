package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.model.entities.EstimationRequestComment;
import com.andersenlab.crm.rest.response.CommentResponse;
import com.andersenlab.crm.rest.sample.EmployeeSample;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class EstimationRequestCommentToResponseConverter implements Converter<EstimationRequestComment, CommentResponse> {

    private final ConversionService conversionService;

    @Override
    public CommentResponse convert(EstimationRequestComment source) {
        CommentResponse target = new CommentResponse();
        target.setId(source.getId());
        target.setCreateDate(source.getCreateDate());
        target.setIsEdited(source.getIsEdited());
        target.setEditDate(source.getEditDate());
        target.setDescription(source.getDescription());
        Optional.ofNullable(source.getEmployee()).ifPresent(employee ->
                target.setEmployee(convertToEmployeeSamplef(employee)));
        Optional.ofNullable(source.getEstimationRequest()).ifPresent(request ->
                target.setRequestId(request.getId()));
        return target;
    }

    @Override
    public Class<EstimationRequestComment> getSource() {
        return EstimationRequestComment.class;
    }

    @Override
    public Class<CommentResponse> getTarget() {
        return CommentResponse.class;
    }

    private EmployeeSample convertToEmployeeSamplef(Employee employee) {
        return conversionService.convert(employee, EmployeeSample.class);
    }
}
