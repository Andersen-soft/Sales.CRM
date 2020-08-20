package com.andersenlab.crm.services.impl;

import com.andersenlab.crm.exceptions.CrmException;
import com.andersenlab.crm.exceptions.ResourceNotFoundException;
import com.andersenlab.crm.model.Message;
import com.andersenlab.crm.model.RecipientDto;
import com.andersenlab.crm.model.RoleEnum;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.model.entities.QEmployee;
import com.andersenlab.crm.model.entities.Role;
import com.andersenlab.crm.repositories.EmployeeRepository;
import com.andersenlab.crm.repositories.ReportRepository;
import com.andersenlab.crm.repositories.RoleRepository;
import com.andersenlab.crm.rest.request.EmployeeUpdateRequest;
import com.andersenlab.crm.rest.response.SaleReportEmployeeResponse;
import com.andersenlab.crm.services.CountryService;
import com.andersenlab.crm.services.EmployeeService;
import com.andersenlab.crm.services.MailService;
import com.andersenlab.crm.services.RoleService;
import com.andersenlab.crm.utils.SkypeBotHelper;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;
import com.querydsl.core.types.dsl.BooleanExpression;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static com.andersenlab.crm.exceptions.ExceptionMessages.*;
import static com.andersenlab.crm.model.RoleEnum.ROLE_MANAGER;
import static com.andersenlab.crm.model.RoleEnum.ROLE_RM;
import static com.andersenlab.crm.model.RoleEnum.ROLE_SALES;
import static com.andersenlab.crm.model.RoleEnum.ROLE_SALES_ASSISTANT;
import static com.andersenlab.crm.model.RoleEnum.ROLE_SALES_HEAD;
import static com.andersenlab.crm.model.RoleEnum.ROLE_SITE;
import static java.lang.Boolean.FALSE;
import static java.lang.Boolean.TRUE;
import static java.util.Optional.ofNullable;
import static org.springframework.transaction.annotation.Isolation.SERIALIZABLE;
import static org.springframework.util.ObjectUtils.isEmpty;

/**
 * Implementation of EmployeeService interface
 *
 * @see EmployeeService
 */
@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {
    private static final String URL = "url";
    private static final String FIO = "fio";
    private static final String LOGIN = "login";
    private static final String SUBJECT_RU = "Смена логина в CRM Andersen";
    private static final String SUBJECT_EN = "Login change in CRM Andersen";

    private final EmployeeRepository employeeRepository;
    private final ReportRepository reportRepository;
    private final RoleRepository roleRepository;
    private final RoleService roleService;
    private final MailService mailService;
    private final CountryService countryService;

    @Value("${app.url}")
    private String crmUrl;

    @Override
    @Transactional(isolation = SERIALIZABLE)
    public Employee createEmployee(Employee employee) {
        return employeeRepository.saveAndFlush(employee);
    }

    @Override
    @Transactional
    public Employee updateEmployee(Long id, EmployeeUpdateRequest updateRequest) {
        Employee persisted = getEmployeeByIdOrThrowException(id);
        validateMentorSetRequestAndSaleAssistantRole(updateRequest.getMentorId(), updateRequest.getRoles(), persisted.getRoles());
        ofNullable(updateRequest.getTelegramUsername())
                .ifPresent(telegram -> validateTelegram(persisted, updateRequest, telegram));
        checkLotteryParticipant(
                persisted.getRoles(),
                updateRequest.getRoles(),
                updateRequest.getLotteryParticipantDay(),
                updateRequest.getLotteryParticipantNight(),
                updateRequest.getLotteryParticipantRegional(),
                persisted.getTelegramUsername()
        );
        String oldLogin = persisted.getLogin();
        if (Boolean.TRUE.equals(persisted.getMayDBAuth())) {
            final Employee employee = employeeRepository.saveAndFlush(updateEmployeeInfo(persisted, updateRequest));
            if (updateRequest.getLogin() != null && !updateRequest.getLogin().equals(oldLogin))
                notifyNewLogin(employee, employee.getLogin());
            return employee;
        } else {
            return employeeRepository.saveAndFlush(updateLdapEmployeeInfo(persisted, updateRequest));
        }
    }

    @Override
    public void validateMentorSetRequestAndSaleAssistantRole(
            final Long mentorId,
            final Long[] updatedEmployeeRoles,
            final Collection<Role> persistedEmployeeRoles
    ) {
        final Collection<Role> rolesList = Objects.isNull(updatedEmployeeRoles) ?
                persistedEmployeeRoles : roleRepository.findAll(Arrays.asList(updatedEmployeeRoles));
        boolean isSaleAssistant = isSaleAssistantHasMultipleRoles(rolesList);
        if (isSaleAssistant && Objects.isNull(mentorId)) {
            throw new CrmException(WRONG_ASSISTANT_WITHOUT_MENTOR_MESSAGE);
        }
        if (rolesList.size() == 1 && !isSaleAssistant && Objects.nonNull(mentorId)) {
            throw new CrmException(WRONG_MENTOR_TO_NON_ASSISTANT_MESSAGE);
        }
        if (rolesList.size() == 1 && isSaleAssistant) {
            checkMentorRoles(mentorId);
        }
    }

    private void checkLotteryParticipant(
            Set<Role> roles,
            Long[] employeeRoles,
            Boolean lotteryParticipantDay,
            Boolean lotteryParticipantNight,
            Boolean lotteryParticipantRegional,
            String telegramUsername) {
        boolean isUpdateRequestHasSale = false;
        if (Objects.nonNull(employeeRoles)) {
            isUpdateRequestHasSale = roleRepository.findAll(Arrays.asList(employeeRoles))
                    .stream()
                    .anyMatch(role -> Objects.equals(RoleEnum.ROLE_SALES, role.getName()));
        }

        boolean lotteryParticipant = TRUE.equals(lotteryParticipantDay)
                || TRUE.equals(lotteryParticipantNight)
                || TRUE.equals(lotteryParticipantRegional);

        boolean isSale = roles.stream()
                .anyMatch(r -> r.getName().equals(RoleEnum.ROLE_SALES));
        if (!isSale && !isUpdateRequestHasSale && TRUE.equals(lotteryParticipant)) {
            throw new CrmException(WRONG_LOTTERY_PARTICIPANT_MESSAGE);
        }

        if (TRUE.equals(lotteryParticipantNight) && telegramUsername == null) {
            throw new CrmException(WRONG_LOTTERY_PARTICIPANT_HAS_NO_TELEGRAM_MESSAGE);
        }
    }

    private boolean isSaleAssistantHasMultipleRoles(Collection<Role> rolesList) {
        final boolean isSaleAssistant = rolesList.stream().anyMatch(role ->
                Objects.equals(ROLE_SALES_ASSISTANT, role.getName()));

        if (rolesList.size() > 1 && isSaleAssistant) {
            throw new CrmException(WRONG_ASSISTANT_ROLES_MESSAGE);
        }
        return isSaleAssistant;
    }

    private void checkMentorRoles(final Long mentorId) {
        final Employee mentor = getEmployeeByIdOrThrowException(mentorId);
        final Set<RoleEnum> mentorRoles = mentor.getRoles()
                .stream()
                .map(Role::getName)
                .collect(Collectors.toSet());
        if (!mentorRoles.contains(RoleEnum.ROLE_SALES) && !mentorRoles.contains(RoleEnum.ROLE_SALES_HEAD)) {
            throw new CrmException(WRONG_MENTOR_ROLES_MESSAGE);
        }
    }

    private Employee updateEmployeeInfo(Employee employeeToUpdate, EmployeeUpdateRequest updateRequest) {
        ofNullable(updateRequest.getEmail())
                .ifPresent(email -> {
                    String toUpdateEmail = employeeToUpdate.getEmail();
                    String updateRequestEmail = updateRequest.getEmail();
                    if (updateRequestEmail.equalsIgnoreCase(toUpdateEmail)) {
                        employeeToUpdate.setEmail(updateRequestEmail);
                    } else {
                        if (existByEmail(email, employeeToUpdate.getId())) {
                            if ("ru".equals(employeeToUpdate.getEmployeeLang()))
                                throw new CrmException(UNIQUE_EMAIL_MESSAGE);
                        } else {
                            throw new CrmException(UNIQUE_EMAIL_MESSAGE_EN);
                        }
                        employeeToUpdate.setEmail(updateRequest.getEmail());
                    }
                });
        ofNullable(updateRequest.getLogin())
                .ifPresent(login -> {
                    if (existByLogin(login, employeeToUpdate.getId())) {
                        throw new CrmException(UNIQUE_LOGIN_MESSAGE);
                    }
                    employeeToUpdate.setLogin(updateRequest.getLogin());
                });
        setEmployeeInfo(employeeToUpdate, updateRequest);
        return employeeToUpdate;
    }

    private void notifyNewLogin(Employee employee, String login) {
        Map<String, Object> args = new HashMap<>();
        String fullName = SkypeBotHelper.getNullableFullName(employee);
        args.put(FIO, fullName);
        args.put(URL, crmUrl);
        args.put(LOGIN, login);

        Message message = Message.builder()
                .template(Message.Template.EMPLOYEE_LOGIN_RESET)
                .subject(SUBJECT_EN)
                .args(args)
                .body("")
                .build();
        mailService.sendMail(RecipientDto.builder().contact(employee.getEmail()).build(), message);
    }

    private boolean existByEmail(String email, Long id) {
        return employeeRepository.existsByEmailAndIdNot(email, id);
    }

    private boolean existByTelegramName(String telegramName, Long id) {
        return employeeRepository.existsByTelegramUsernameAndIdNot(telegramName, id);
    }

    private boolean existByLogin(String login, Long id) {
        return employeeRepository.existsByLoginAndIdNot(login, id);
    }

    private Employee updateLdapEmployeeInfo(Employee employeeToUpdate, EmployeeUpdateRequest update) {
        if (update.getLogin() != null) {
            throw new CrmException("Нельзя сменить логин пользователю с AD");
        }
        if (update.getEmail() != null) {
            throw new CrmException("Нельзя сменить email пользователю с AD");
        }
        setEmployeeInfo(employeeToUpdate, update);
        return employeeToUpdate;
    }

    private void validateTelegram(Employee employeeToUpdate, EmployeeUpdateRequest update, String telegram) {
        if (existByTelegramName(telegram, employeeToUpdate.getId())) {
            throw new CrmException(UNIQUE_TELEGRAM_NAME_MESSAGE);
        } else if ((FALSE.equals(update.getLotteryParticipantNight()) || !employeeToUpdate.isNightDistributionParticipant())
                && StringUtils.isEmpty(telegram)) {
            employeeToUpdate.setTelegramUsername(null);
        } else if (employeeToUpdate.isNightDistributionParticipant()
                && StringUtils.isEmpty(telegram)) {
            throw new CrmException(WRONG_LOTTERY_PARTICIPANT_HAS_NO_TELEGRAM_MESSAGE);
        } else {
            employeeToUpdate.setTelegramUsername(telegram);
        }
    }

    /**
     * Sets new properties to existing employee.
     *
     * @param update           properties source
     * @param employeeToUpdate to update
     */
    @SuppressWarnings("all")
    private void setEmployeeInfo(Employee employeeToUpdate, EmployeeUpdateRequest update) {
        ofNullable(update.getAdditionalInfo())
                .ifPresent(employeeToUpdate::setAdditionalInfo);
        Optional.ofNullable(update.getAdditionalEmails())
                .ifPresent(emails -> {
                    emails.forEach(email -> {
                        Employee lookup = employeeRepository.findByEmailIncludingAdditionalAndInactive(email);
                        if (lookup != null && !employeeToUpdate.equals(lookup)) {
                            throw new CrmException(UNIQUE_EMAIL_MESSAGE);
                        }
                    });

                    employeeToUpdate.setAdditionalEmails(new HashSet<>(emails));
                });
        ofNullable(update.getFirstName())
                .ifPresent(employeeToUpdate::setFirstName);
        ofNullable(update.getLastName())
                .ifPresent(employeeToUpdate::setLastName);
        ofNullable(update.getPhone())
                .ifPresent(employeeToUpdate::setPhone);
        ofNullable(update.getSkype())
                .ifPresent(employeeToUpdate::setSkype);
        ofNullable(update.getEmployeeLang())
                .ifPresent(employeeToUpdate::setEmployeeLang);
        ofNullable(update.getRoles())
                .ifPresent(roles -> {
                    List<Role> rolesList = roleRepository.findAll(Arrays.asList(roles));
                    if (rolesList.stream()
                            .noneMatch(role -> ROLE_SALES_ASSISTANT.equals(role.getName()))) {
                        employeeToUpdate.setMentor(null);
                    }
                    if (rolesList.stream()
                            .noneMatch(role -> ROLE_RM.equals(role.getName()))) {
                        employeeToUpdate.setResponsibleRM(false);
                    }
                    employeeToUpdate.setRoles(roleService.getRolesOrThrowException(roles));
                });
        ofNullable(update.getIsActive())
                .ifPresent(active -> {
                    if (active) {
                        employeeToUpdate.setIsActive(active);
                    } else {
                        employeeToUpdate.setIsActive(active);
                        employeeToUpdate.setResponsibleRM(false);
                        employeeToUpdate.setLotteryParticipant(false);
                        employeeToUpdate.setDayDistributionParticipant(false);
                        employeeToUpdate.setNightDistributionParticipant(false);
                        employeeToUpdate.setRegionalDistributionParticipant(false);
                        employeeToUpdate.setResponsibleRM(false);
                    }
                });
        ofNullable(update.getPosition())
                .ifPresent(employeeToUpdate::setPosition);
        ofNullable(update.getCleanCountries()).ifPresent(clean -> {
            employeeToUpdate.setCountries(null);
            employeeToUpdate.setAutoDistributionDate(null);
        });
        ofNullable(update.getCountries()).ifPresent(countries -> {
            if (isEmpty(employeeToUpdate.getCountries()) && isEmpty(employeeToUpdate.getAutoDistributionDate())) {
                employeeToUpdate.setAutoDistributionDate(LocalDateTime.now());
            }
            employeeToUpdate.setCountries(countryService.getCountriesOrThrowException(countries));
        });

        ofNullable(update.getLotteryParticipantDay())
                .ifPresent(lottery -> {
                    if (TRUE.equals(lottery) && !employeeToUpdate.getIsActive()) {
                        throw new CrmException("Inactive user cannot participate in leads distribution");
                    }

                    employeeToUpdate.setDayDistributionParticipant(lottery);
                    if (TRUE.equals(lottery) && isEmpty(employeeToUpdate.getDayDistributionDate())) {
                        employeeToUpdate.setDayDistributionDate(LocalDateTime.now());
                    }
                });

        ofNullable(update.getLotteryParticipantNight())
                .ifPresent(lottery -> {
                    if (TRUE.equals(lottery) && !employeeToUpdate.getIsActive()) {
                        throw new CrmException("Inactive user cannot participate in leads distribution");
                    }

                    employeeToUpdate.setNightDistributionParticipant(lottery);
                    if (TRUE.equals(lottery) && isEmpty(employeeToUpdate.getNightDistributionDate())) {
                        employeeToUpdate.setNightDistributionDate(LocalDateTime.now());
                    }
                });

        ofNullable(update.getLotteryParticipantRegional())
                .ifPresent(lottery -> {
                    if (TRUE.equals(lottery) && !employeeToUpdate.getIsActive()) {
                        throw new CrmException("Inactive user cannot participate in leads distribution");
                    }

                    employeeToUpdate.setRegionalDistributionParticipant(lottery);
                    if (TRUE.equals(lottery) && isEmpty(employeeToUpdate.getRegionalDistributionDate())) {
                        employeeToUpdate.setRegionalDistributionDate(LocalDateTime.now());
                    }
                });

        ofNullable(update.getMentorId()).ifPresent(mentorId ->
                employeeToUpdate.setMentor(getEmployeeByIdOrThrowException(mentorId)));
        ofNullable(update.getResponsibleRM()).ifPresent(rm -> {
            if (TRUE.equals(update.getResponsibleRM()) && !employeeToUpdate.getIsActive()) {
                throw new CrmException("Inactive user cannot be set as Responsible RM");
            }
            checkRoleRmAndSetResponsibleRM(employeeToUpdate, rm);
        });
    }

    private void checkRoleRmAndSetResponsibleRM(Employee employeeToUpdate, Boolean r) {
        if (TRUE.equals(r)) {
            if (isUserHasRoleRM(employeeToUpdate)) {
                employeeToUpdate.setResponsibleRM(r);
                employeeToUpdate.setDistributionDateRm(LocalDateTime.now());
            } else {
                throw new CrmException("exception.employeeService.employeeUpdate.checkROleRM");
            }
        } else {
            if (countResposibleRM() <= 1 && (isUserHasRoleRM(employeeToUpdate))) {
                throw new CrmException("exception.employeeService.employeeUpdate.checkRoleRmAndSetResponsibleRM");
            }
            employeeToUpdate.setResponsibleRM(r);
            employeeToUpdate.setDistributionDateRm(null);
        }
    }

    @Override
    public Employee getEmployeeByIdOrThrowException(Long id) {
        return ofNullable(employeeRepository.findOne(id))
                .orElseThrow(() -> new ResourceNotFoundException(EMPLOYEE_NOT_FOUND_MESSAGE));
    }


    @Override
    @Transactional(readOnly = true)
    public Employee findByLogin(String login) {
        return ofNullable(employeeRepository.findEmployeeByLogin(login))
                .orElseThrow(() -> new ResourceNotFoundException(EMPLOYEE_NOT_FOUND_MESSAGE + " login:[" + login + "]"));
    }

    @Override
    public boolean exists(Predicate predicate) {
        return employeeRepository.exists(predicate);
    }

    @Override
    public Page<Employee> getEmployeesWithFilter(Predicate predicate, Pageable pageable) {
        return employeeRepository.findAll(predicate, pageable);
    }

    @Override
    public List<Employee> getAll() {
        return employeeRepository.findAll();
    }

    @Transactional
    @Override
    public void saveEmployee(Employee employee) {
        employeeRepository.saveAndFlush(employee);
    }

    @Override
    public boolean exist(Long id) {
        return employeeRepository.exists(id);
    }

    @Override
    public void validateByIdAndRole(Long id, RoleEnum roleEnum) {
        Employee entity = getEmployeeByIdOrThrowException(id);
        boolean isRoleNotEquals = entity.getRoles().stream()
                .map(Role::getName)
                .noneMatch(role -> role.equals(roleEnum));
        if (isRoleNotEquals) {
            throw new CrmException("Пользователь с id = " + id + " и ролью " + roleEnum + " не найден");
        }
    }

    @Override
    public Page<SaleReportEmployeeResponse> getReportEmployees(Predicate predicate, Pageable pageable) {
        List<SaleReportEmployeeResponse> reportEmployees = StreamSupport
                .stream(reportRepository.findAll(predicate, pageable.getSort()).spliterator(), false)
                .map(report -> SaleReportEmployeeResponse.builder()
                        .id(report.getResponsibleId())
                        .name(report.getResponsibleName())
                        .build())
                .distinct()
                .collect(Collectors.toList());
        return new PageImpl<>(reportEmployees, pageable, reportEmployees.size());
    }

    @Override
    public Employee findByEmail(String email) {
        return employeeRepository.findByEmailIncludingAdditional(email);
    }

    @Override
    public boolean existsByEmailIncludingAdditional(String email) {
        return employeeRepository.findByEmailIncludingAdditionalAndInactive(email) != null;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Employee> getEmployeesByRole(RoleEnum role) {
        Predicate employersFilter = QEmployee.employee.roles.any().name.eq(role)
                .and(QEmployee.employee.isActive.eq(true));
        return StreamSupport.stream(employeeRepository.findAll(employersFilter).spliterator(), false)
                .collect(Collectors.toList());
    }

    @Override
    public List<Employee> getEmployeesByRole(List<RoleEnum> roleList) {
        BooleanExpression filter = QEmployee.employee.isActive.eq(true);
        BooleanBuilder roleExpression = new BooleanBuilder();
        for (RoleEnum role : roleList) {
            roleExpression = roleExpression.or(QEmployee.employee.roles.any().name.eq(role));
        }

        filter = filter.and(roleExpression);

        return StreamSupport.stream(employeeRepository.findAll(filter).spliterator(), false)
                .collect(Collectors.toList());
    }

    @Override
    public List<Employee> getForMailExpressSale() {
        List<RoleEnum> roleList = Arrays.asList(ROLE_SALES, ROLE_SALES_HEAD, ROLE_MANAGER);
        List<Employee> byRoles = getEmployeesByRole(roleList);
        byRoles.removeIf(e -> e.getRoles().stream()
                .anyMatch(r -> ROLE_SITE.equals(r.getName())));
        return byRoles;
    }

    private long countResposibleRM() {
        Predicate employersFilter = QEmployee.employee.responsibleRM.isTrue();
        return employeeRepository.count(employersFilter);
    }

    private boolean isUserHasRoleRM(Employee employeeToUpdate) {
        return employeeToUpdate.getRoles().stream().anyMatch(roleRM -> roleRM.getName().equals(ROLE_RM));
    }
}
