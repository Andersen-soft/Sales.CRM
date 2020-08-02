package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.model.entities.ResumeRequestComment;
import org.springframework.stereotype.Component;

@Component
public class ResumeRequestCommentToResponseConverter
        extends CommentToCommentResponseConverter<ResumeRequestComment> {

    public ResumeRequestCommentToResponseConverter(ConversionService conversionService) {
        super(conversionService);
    }

    @Override
    public Class<ResumeRequestComment> getSource() {
        return ResumeRequestComment.class;
    }
}
