package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.entities.Activity;
import com.andersenlab.crm.model.entities.Contact;
import com.andersenlab.crm.rest.request.ActivityCreateRequest;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static com.andersenlab.crm.utils.CrmStringUtils.fixStringDescription;

@Component
public class ActivityCreateRequestToActivityConverter implements Converter<ActivityCreateRequest, Activity> {

    @Override
    public Activity convert(ActivityCreateRequest source) {
        Activity target = new Activity();
        target.setDateActivity(source.getDateActivity());
        target.setDescription(fixStringDescription(source.getDescription()));
        target.setContacts(defineContacts(source.getContacts()));
        return target;
    }

    @Override
    public Class<ActivityCreateRequest> getSource() {
        return ActivityCreateRequest.class;
    }

    @Override
    public Class<Activity> getTarget() {
        return Activity.class;
    }

    private Set<Contact> defineContacts(List<Long> contactIds) {
        if (CollectionUtils.isEmpty(contactIds)) {
            return new HashSet<>();
        }
        return contactIds.stream()
                .map(Contact::new)
                .collect(Collectors.toSet());
    }
}
