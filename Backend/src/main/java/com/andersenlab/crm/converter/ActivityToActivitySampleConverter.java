package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.entities.Activity;
import com.andersenlab.crm.rest.sample.ActivitySample;
import org.springframework.stereotype.Component;

@Component
public class ActivityToActivitySampleConverter implements Converter<Activity, ActivitySample> {

    @Override
    public ActivitySample convert(Activity source) {
        ActivitySample target = new ActivitySample();
        target.setDateActivity(source.getDateActivity());
        target.setDescription(source.getDescription());
        return target;
    }

    @Override
    public Class<Activity> getSource() {
        return Activity.class;
    }

    @Override
    public Class<ActivitySample> getTarget() {
        return ActivitySample.class;
    }
}
