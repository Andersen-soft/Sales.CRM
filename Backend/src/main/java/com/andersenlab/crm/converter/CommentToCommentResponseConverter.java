package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.entities.Comment;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.rest.response.CommentResponse;
import com.andersenlab.crm.rest.sample.EmployeeSample;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public abstract class CommentToCommentResponseConverter<T extends Comment>
        implements Converter<T, CommentResponse> {

    private final ConversionService conversionService;

    @Override
    public CommentResponse convert(Comment source) {
        CommentResponse target = new CommentResponse();
        target.setId(source.getId());
        target.setCreateDate(source.getCreateDate());
        target.setIsEdited(source.getIsEdited());
        target.setEditDate(source.getEditDate());
        target.setDescription(source.getDescription());
        target.setEmployee(convertToEmployeeSample(source.getEmployee()));
        return target;
    }

    @Override
    public Class<CommentResponse> getTarget() {
        return CommentResponse.class;
    }

    private EmployeeSample convertToEmployeeSample(Employee employee) {
        return conversionService.convert(employee, EmployeeSample.class);
    }
}
