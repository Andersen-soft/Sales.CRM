package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.entities.ResumeRequestComment;
import com.andersenlab.crm.rest.request.CommentCreateRequest;
import org.springframework.stereotype.Component;

@Component
public class CommentCreateRequestToResumeRequestCommentConverter
        implements Converter<CommentCreateRequest, ResumeRequestComment> {

    @Override
    public ResumeRequestComment convert(CommentCreateRequest source) {
        ResumeRequestComment target = new ResumeRequestComment();
        target.setDescription(source.getDescription());
        return target;
    }

    @Override
    public Class<CommentCreateRequest> getSource() {
        return CommentCreateRequest.class;
    }

    @Override
    public Class<ResumeRequestComment> getTarget() {
        return ResumeRequestComment.class;
    }
}
