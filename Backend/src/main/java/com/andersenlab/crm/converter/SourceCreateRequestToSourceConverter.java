package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.entities.Source;
import com.andersenlab.crm.rest.request.SourceCreateRequest;
import org.springframework.stereotype.Component;

@Component
public class SourceCreateRequestToSourceConverter implements Converter<SourceCreateRequest, Source> {

    @Override
    public Source convert(SourceCreateRequest source) {
        Source target = new Source();
        target.setName(source.getName());
        target.setType(source.getType());
        return target;
    }

    @Override
    public Class<SourceCreateRequest> getSource() {
        return SourceCreateRequest.class;
    }

    @Override
    public Class<Source> getTarget() {
        return Source.class;
    }
}
