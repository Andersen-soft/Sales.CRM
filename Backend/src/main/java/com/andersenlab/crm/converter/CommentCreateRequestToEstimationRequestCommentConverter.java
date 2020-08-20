package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.entities.EstimationRequestComment;
import com.andersenlab.crm.rest.request.CommentCreateRequest;
import org.springframework.stereotype.Component;

@Component
public class CommentCreateRequestToEstimationRequestCommentConverter
        implements Converter<CommentCreateRequest, EstimationRequestComment> {

    @Override
    public EstimationRequestComment convert(CommentCreateRequest source) {
        EstimationRequestComment target = new EstimationRequestComment();
        target.setDescription(source.getDescription());
        return target;
    }

    @Override
    public Class<CommentCreateRequest> getSource() {
        return CommentCreateRequest.class;
    }

    @Override
    public Class<EstimationRequestComment> getTarget() {
        return EstimationRequestComment.class;
    }
}
