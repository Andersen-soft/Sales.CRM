package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.model.entities.ResumeComment;
import org.springframework.stereotype.Component;

@Component
public class ResumeCommentToResponseConverter
        extends CommentToCommentResponseConverter<ResumeComment> {

    public ResumeCommentToResponseConverter(ConversionService conversionService) {
        super(conversionService);
    }

    @Override
    public Class<ResumeComment> getSource() {
        return ResumeComment.class;
    }
}
