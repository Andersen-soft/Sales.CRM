package com.andersenlab.crm.converter.comment;


import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.model.entities.ResumeRequestComment;
import com.andersenlab.crm.rest.dto.CommentDto;
import com.andersenlab.crm.rest.dto.EmployeeDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class CommentToCommentDto implements Converter<ResumeRequestComment, CommentDto> {

    private final ConversionService conversionService;

    @Override
    public CommentDto convert(ResumeRequestComment source) {
        CommentDto target = new CommentDto();
        target.setId(source.getId());
        target.setDescription(source.getDescription());
        Optional.ofNullable(source.getEmployee()).ifPresent(s -> target.setEmployee(defineEmployee(s)));
        target.setCreated(source.getCreateDate());
        target.setIsEdited(source.getIsEdited());
        Optional.ofNullable(source.getResumeRequest()).ifPresent(request -> target.setRequestId(request.getId()));
        return target;
    }

    @Override
    public Class<ResumeRequestComment> getSource() {
        return ResumeRequestComment.class;
    }

    @Override
    public Class<CommentDto> getTarget() {
        return CommentDto.class;
    }

    private EmployeeDto defineEmployee(Employee source) {
        return conversionService.convert(source, EmployeeDto.class);
    }
}
