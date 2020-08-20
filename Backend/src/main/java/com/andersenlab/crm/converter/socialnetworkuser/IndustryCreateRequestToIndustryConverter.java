package com.andersenlab.crm.converter.socialnetworkuser;

import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.entities.Industry;
import com.andersenlab.crm.rest.request.IndustryCreateRequest;
import org.springframework.stereotype.Component;

@Component
public class IndustryCreateRequestToIndustryConverter implements Converter<IndustryCreateRequest, Industry> {
    @Override
    public Industry convert(IndustryCreateRequest source) {
        Industry target = new Industry();
        target.setId(source.getId());
        return target;
    }

    @Override
    public Class<IndustryCreateRequest> getSource() {
        return IndustryCreateRequest.class;
    }

    @Override
    public Class<Industry> getTarget() {
        return Industry.class;
    }
}
