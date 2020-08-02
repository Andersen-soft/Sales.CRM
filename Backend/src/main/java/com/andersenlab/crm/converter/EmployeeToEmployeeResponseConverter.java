package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.entities.Country;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.model.entities.Role;
import com.andersenlab.crm.repositories.ActivityRepository;
import com.andersenlab.crm.rest.response.CountryDto;
import com.andersenlab.crm.rest.response.EmployeeResponse;
import com.andersenlab.crm.rest.response.RoleResponse;
import com.andersenlab.crm.rest.sample.EmployeeSample;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class EmployeeToEmployeeResponseConverter implements Converter<Employee, EmployeeResponse> {
    private final ConversionService conversionService;

    private final ActivityRepository activityRepository;

    @Override
    public Class<Employee> getSource() {
        return Employee.class;
    }

    @Override
    public Class<EmployeeResponse> getTarget() {
        return EmployeeResponse.class;
    }

    @Override
    public EmployeeResponse convert(Employee source) {
        EmployeeResponse target = new EmployeeResponse();
        target.setIsActive(source.getIsActive());
        target.setLogin(source.getLogin());
        target.setAdditionalInfo(source.getAdditionalInfo());
        target.setEmail(source.getEmail());
        target.setAdditionalEmails(new ArrayList<>(source.getAdditionalEmails()));
        target.setFirstName(source.getFirstName());
        target.setPhone(source.getPhone());
        target.setLastName(source.getLastName());
        target.setSkype(source.getSkype());
        target.setEmployeeLang(source.getEmployeeLang());
        target.setId(source.getId());
        target.setRoles(convertRoles(source.getRoles()));
        Optional.ofNullable(source.getCountries()).ifPresent(countries -> target.setCountries(convertCountries(countries)));
        target.setTelegramUsername(source.getTelegramUsername());
        target.setLotteryParticipantDay(source.isDayDistributionParticipant());
        target.setLotteryParticipantNight(source.isNightDistributionParticipant());
        target.setLotteryParticipantRegional(source.isRegionalDistributionParticipant());
        target.setPosition(source.getPosition());
        target.setIsLdapUser(source.getMayDBAuth() != null ? !source.getMayDBAuth() : null);
        Optional.ofNullable(source.getMentor()).ifPresent(mentor ->
                target.setMentor(defineEmployee(source.getMentor()))
        );
        target.setHasActivities(activityRepository.existsActivityByResponsibleId(source.getId()));
        target.setResponsibleRM(source.getResponsibleRM() != null && source.getResponsibleRM());
        return target;
    }

    private Set<RoleResponse> convertRoles(Set<Role> roles) {
        Set<RoleResponse> responseRoles = new HashSet<>();
        roles.forEach(role -> responseRoles.add(new RoleResponse(role.getId(), role.getName().getName())));
        return responseRoles;
    }

    private Set<CountryDto> convertCountries(Set<Country> countries) {
        Set<CountryDto> countryResponse = new HashSet<>();
        countries.forEach(country -> countryResponse.add(new CountryDto(country.getId(), country.getNameRu())));
        return countryResponse;
    }

    private EmployeeSample defineEmployee(final Employee employee) {
        return conversionService.convert(employee, EmployeeSample.class);
    }
}
