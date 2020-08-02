package com.andersenlab.crm.services;

import com.andersenlab.crm.model.entities.Activity;
import com.andersenlab.crm.model.entities.ActivityReport;
import com.andersenlab.crm.model.entities.CompanySale;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.rest.request.ActivityCreateRequest;
import com.andersenlab.crm.rest.request.ActivityUpdateRequest;
import com.andersenlab.crm.rest.response.ActivityTypeResponse;
import com.querydsl.core.types.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Locale;

public interface ActivityService {
    Long createActivity(Activity activity);

    Long createActivity(ActivityCreateRequest request);

    Long createActivity(ActivityCreateRequest request, Employee employee);

    Activity getActivityById(Long id);

    Page<Activity> getActivitiesWithFilter(Predicate predicate, Pageable pageable);

    Long updateActivity(Long id, ActivityUpdateRequest request);

    Page<Activity> getActivitiesWithSearch(String query, Predicate predicate, Pageable pageable);

    void deleteActivity(Long id);

    Collection<ActivityTypeResponse> getTypeNames(Locale locale);

    List<ActivityReport> getReports(LocalDate from, LocalDate to);

    CompanySale refreshSaleActivities(CompanySale sale, Activity currentActivity);
}
