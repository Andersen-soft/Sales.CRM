package com.andersenlab.crm.rest.facade;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.model.entities.Source;
import com.andersenlab.crm.rest.request.SourceCreateRequest;
import com.andersenlab.crm.rest.response.SourceResponse;
import com.andersenlab.crm.services.SourceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SourceFacadeImpl implements SourceFacade{

    private final SourceService sourceService;
    private final ConversionService conversionService;

    @Override
    public SourceResponse create(SourceCreateRequest request){
        Source converted = conversionService.convert(request, Source.class);
        return conversionService.convert(sourceService.createSource(converted), SourceResponse.class);
    }
}
