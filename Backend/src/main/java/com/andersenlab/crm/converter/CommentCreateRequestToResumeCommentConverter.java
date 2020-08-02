package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.entities.ResumeComment;
import com.andersenlab.crm.rest.request.CommentCreateRequest;
import org.springframework.stereotype.Component;

@Component
public class CommentCreateRequestToResumeCommentConverter
        implements Converter<CommentCreateRequest, ResumeComment> {

    @Override
    public ResumeComment convert(CommentCreateRequest source) {
        ResumeComment target = new ResumeComment();
        target.setDescription(source.getDescription());
        return target;
    }

    @Override
    public Class<CommentCreateRequest> getSource() {
        return CommentCreateRequest.class;
    }

    @Override
    public Class<ResumeComment> getTarget() {
        return ResumeComment.class;
    }
}
