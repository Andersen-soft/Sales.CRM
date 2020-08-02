package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.entities.Activity;
import com.andersenlab.crm.model.entities.ActivityType;
import com.andersenlab.crm.model.entities.Contact;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.rest.response.ActivityResponse;
import com.andersenlab.crm.rest.response.ActivityTypeResponse;
import com.andersenlab.crm.services.i18n.I18nService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import static com.andersenlab.crm.utils.ConverterHelper.getNullable;

@Component
@RequiredArgsConstructor
public class ActivityToActivityResponseConverter implements Converter<Activity, ActivityResponse> {
    private final I18nService i18n;

    @Override
    public ActivityResponse convert(Activity source) {
        ActivityResponse target = new ActivityResponse();
        target.setId(source.getId());
        target.setDescription(source.getDescription());
        target.setResponsibleName(getNullable(source.getResponsible(),
                employee -> employee.getFirstName() + " " + employee.getLastName()));
        target.setDateActivity(source.getDateActivity());
        target.setContacts(defineContacts(source.getContacts()));
        target.setTypes(activityTypesToResponseList(source.getActivityTypes()));
        target.setResponsibleId(getNullable(source.getResponsible(), Employee::getId));
        Optional.ofNullable(source.getCompanySale()).ifPresent(companySale -> {
                target.setCompanyName(companySale.getCompanyName());
                target.setCompanySale(companySale.getId());
        });
        return target;
    }

    @Override
    public ActivityResponse convertWithLocale(Activity source, Locale locale) {
        ActivityResponse target = convert(source);
        target.getTypes().forEach(v -> v.setType(i18n.getLocalizedMessage(v.getType(), locale)));
        return target;
    }

    private List<ActivityResponse.ContactResponse> defineContacts(Set<Contact> contacts) {
        return contacts.stream()
                .map(c -> new ActivityResponse.ContactResponse(c.getId(), c.getFirstName(), c.getLastName()))
                .collect(Collectors.toList());
    }

    @Override
    public Class<Activity> getSource() {
        return Activity.class;
    }

    @Override
    public Class<ActivityResponse> getTarget() {
        return ActivityResponse.class;
    }

    private List<ActivityTypeResponse> activityTypesToResponseList(Set<ActivityType> types) {
        return types.stream()
                .map(v -> Activity.TypeEnum.valueOf(v.getType()))
                .map(v -> ActivityTypeResponse.builder()
                        .ordinal(v.ordinal())
                        .type(v.getName())
                        .typeEnumCode(v.name())
                        .build())
                .collect(Collectors.toList());
    }
}
