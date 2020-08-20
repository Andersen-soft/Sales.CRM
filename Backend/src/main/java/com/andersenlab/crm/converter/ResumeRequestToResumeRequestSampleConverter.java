package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.entities.ResumeRequest;
import com.andersenlab.crm.rest.sample.ResumeRequestSample;
import org.springframework.stereotype.Component;

@Component
public class ResumeRequestToResumeRequestSampleConverter implements Converter<ResumeRequest, ResumeRequestSample> {

    @Override
    public ResumeRequestSample convert(ResumeRequest source) {
        ResumeRequestSample resumeRequestSample = new ResumeRequestSample();
        resumeRequestSample.setId(source.getId());
        resumeRequestSample.setName(source.getName());
        resumeRequestSample.setOldId(source.getOldId());
        return resumeRequestSample;
    }

    @Override
    public Class<ResumeRequest> getSource() {
        return ResumeRequest.class;
    }

    @Override
    public Class<ResumeRequestSample> getTarget() {
        return ResumeRequestSample.class;
    }
}
