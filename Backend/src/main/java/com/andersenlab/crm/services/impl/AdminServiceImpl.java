package com.andersenlab.crm.services.impl;

import com.andersenlab.crm.configuration.CrmLdapHelper;
import com.andersenlab.crm.configuration.properties.ApplicationProperties;
import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.exceptions.CrmException;
import com.andersenlab.crm.exceptions.ResourceNotFoundException;
import com.andersenlab.crm.model.LdapUser;
import com.andersenlab.crm.model.Message;
import com.andersenlab.crm.model.RecipientDto;
import com.andersenlab.crm.model.RoleEnum;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.model.entities.QEmployee;
import com.andersenlab.crm.model.entities.QRole;
import com.andersenlab.crm.model.entities.Role;
import com.andersenlab.crm.model.entities.VerificationKey;
import com.andersenlab.crm.repositories.RoleRepository;
import com.andersenlab.crm.rest.dto.ChangePassDto;
import com.andersenlab.crm.rest.request.EmployeeCreateRequest;
import com.andersenlab.crm.security.TokenManager;
import com.andersenlab.crm.services.AdminService;
import com.andersenlab.crm.services.CountryService;
import com.andersenlab.crm.services.EmployeeService;
import com.andersenlab.crm.services.MailService;
import com.andersenlab.crm.services.PasswordGenerateService;
import com.andersenlab.crm.services.TokenService;
import com.andersenlab.crm.utils.SkypeBotHelper;
import io.jsonwebtoken.ExpiredJwtException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static com.andersenlab.crm.exceptions.ExceptionMessages.CHANGING_AD_PASS_MESSAGE;
import static com.andersenlab.crm.exceptions.ExceptionMessages.LOGIN_EXISTS_MESSAGE;
import static com.andersenlab.crm.exceptions.ExceptionMessages.UNIQUE_EMAIL_MESSAGE;
import static com.andersenlab.crm.exceptions.ExceptionMessages.WRONG_LOTTERY_PARTICIPANT_HAS_NO_TELEGRAM_MESSAGE;
import static com.andersenlab.crm.exceptions.ExceptionMessages.WRONG_LOTTERY_PARTICIPANT_MESSAGE;
import static com.andersenlab.crm.exceptions.ExceptionMessages.WRONG_RESPONSIBLE_RM_MESSAGE;
import static com.andersenlab.crm.exceptions.ExceptionMessages.WRONG_ROLES_MESSAGE;
import static java.lang.Boolean.TRUE;
import static java.util.Optional.ofNullable;
import static org.apache.commons.lang3.StringUtils.containsIgnoreCase;

@Slf4j
@RequiredArgsConstructor
@Service
public class AdminServiceImpl implements AdminService {
    private static final String URL = "url";
    private static final String APP_URL = "appUrl";
    private static final String FIO = "fio";

    private final EmployeeService employeeService;
    private final CrmLdapHelper crmLdapHelper;
    private final BCryptPasswordEncoder passwordEncoder;
    private final MailService mailService;
    private final RoleRepository roleRepository;
    private final CountryService countryService;
    private final ConversionService conversionService;
    private final TokenManager tokenManager;
    private final TokenService tokenService;
    private final PasswordGenerateService passGenerator;
    private final ApplicationProperties applicationProperties;

    @Override
    public Employee registerInCrm(EmployeeCreateRequest request) {
        validateEmployeeCreateRequest(request);

        String password = passGenerator.generatePassayPassword();
        String encodedPassword = passwordEncoder.encode(password);

        Employee employee = conversionService.convert(request, Employee.class);
        employee.setPassword(encodedPassword);
        employee.setRoles(getRoles(request));

        setLotteryParticipantFields(employee, request);

        List<LdapUser> ldapUsers = new ArrayList<>(crmLdapHelper.getAllUsers());
        removeUsers(ldapUsers, false);
        boolean isLdapUser = isLdapUser(employee, ldapUsers);
        employee.setMayDBAuth(!isLdapUser);

        Employee persisted = employeeService.createEmployee(employee);
        notifyRegistration(persisted, isLdapUser);

        return persisted;
    }

    private void setLotteryParticipantFields(Employee employee, EmployeeCreateRequest request) {
        // !-- Если со фронта будет передаваться флаг lotteryParticipantRegional,
        //     то его надо будет включить в условие ---
        if (request.getCountryId() != null) {
            employee.setCountries(countryService.getCountriesOrThrowException(request.getCountryId()));
            employee.setRegionalDistributionParticipant(true);
            employee.setRegionalDistributionDate(LocalDateTime.now());
        }
        if (TRUE.equals(request.getLotteryParticipantDay())) {
            employee.setDayDistributionParticipant(true);
            employee.setDayDistributionDate(LocalDateTime.now());
        }
        if (TRUE.equals(request.getLotteryParticipantNight())) {
            employee.setNightDistributionParticipant(true);
            employee.setNightDistributionDate(LocalDateTime.now());
        }
    }

    private Set<Role> getRoles(EmployeeCreateRequest request) {
        Iterable<Role> rolesIterable = roleRepository.findAll(QRole.role.id.in(Arrays.asList(request.getRoles())));
        Set<Role> roles = StreamSupport.stream(rolesIterable.spliterator(), false).collect(Collectors.toSet());
        if (roles.isEmpty()) {
            throw new CrmException(WRONG_ROLES_MESSAGE);
        }
        return roles;
    }

    private void validateEmployeeCreateRequest(EmployeeCreateRequest request) {
        List<String> allEmails = new ArrayList<>(request.getAdditionalEmails());
        allEmails.add(request.getEmail());
        allEmails.forEach(email -> {
            if (employeeService.existsByEmailIncludingAdditional(email)) {
                throw new CrmException(UNIQUE_EMAIL_MESSAGE);
            }
        });

        ofNullable(request.getTelegramUsername()).ifPresent(t -> {
            if (employeeService.exists(QEmployee.employee.telegramUsername.eq(t))) {
                throw new CrmException("Такой телеграм @%s уже существует в системе", t);
            }
        });

        List<Role> requestRoles = roleRepository.findAll(Arrays.asList(request.getRoles()));

        boolean isCreateRequestHasSale = requestRoles.stream()
                .anyMatch(role -> Objects.equals(RoleEnum.ROLE_SALES, role.getName()));
        boolean isLotteryTrue = TRUE.equals(request.getLotteryParticipantDay())
                || TRUE.equals(request.getLotteryParticipantNight())
                || TRUE.equals(request.getLotteryParticipantRegional());
        if (!isCreateRequestHasSale && isLotteryTrue) {
            throw new CrmException(WRONG_LOTTERY_PARTICIPANT_MESSAGE);
        } else if (TRUE.equals(request.getLotteryParticipantNight()) && request.getTelegramUsername() == null) {
            throw new CrmException(WRONG_LOTTERY_PARTICIPANT_HAS_NO_TELEGRAM_MESSAGE);
        }

        boolean createRequestHasRoleRm = requestRoles.stream()
                .anyMatch(role -> Objects.equals(RoleEnum.ROLE_RM, role.getName()));
        if (!createRequestHasRoleRm && TRUE.equals(request.getResponsibleRM())) {
            throw new CrmException(WRONG_RESPONSIBLE_RM_MESSAGE);
        }

        try {
            Employee persisted = employeeService.findByLogin(request.getLogin());
            String name = Objects.toString(persisted.getFirstName(), "")
                    + " "
                    + Objects.toString(persisted.getLastName(), "");
            throw new CrmException(String.format(LOGIN_EXISTS_MESSAGE, name, name));

        } catch (ResourceNotFoundException e) {
            log.info("Верификация нового логина :[{}]", request.getLogin());
            log.debug(e.getMessage());
        }

        employeeService.validateMentorSetRequestAndSaleAssistantRole(request.getMentorId(), request.getRoles(), new ArrayList<>());
    }

    private void notifyRegistration(Employee employee, boolean isLdapUser) {
        Map<String, Object> args = new HashMap<>();
        String fullName = SkypeBotHelper.getNullableFullName(employee);
        String url = isLdapUser
                ? applicationProperties.getUrl()
                : applicationProperties.getUrl() + "/login?k=" + tokenManager.createTokenKey(employee.getLogin());
        Message.Template template = isLdapUser ? Message.Template.EMPLOYEE_AD_REGISTER : Message.Template.EMPLOYEE_REGISTER;
        args.put(FIO, fullName);
        args.put(URL, url);
        if (!isLdapUser) {
            args.put(APP_URL, applicationProperties.getUrl());
        }

        Message message = Message.builder()
                .template(template)
                .subject("Registration in CRM Andersen")
                .args(args)
                .body("")
                .build();
        mailService.sendMail(RecipientDto.builder().contact(employee.getEmail()).build(), message);
    }

    private void notifyResetPassword(Employee employee) {
        Map<String, Object> args = new HashMap<>();
        String fullName = SkypeBotHelper.getNullableFullName(employee);
        args.put(FIO, fullName);
        args.put(URL, applicationProperties.getUrl() + "/login?k=" + tokenManager.createTokenKey(employee.getLogin()));
        args.put(APP_URL, applicationProperties.getUrl());

        Message message = Message.builder()
                .template(Message.Template.EMPLOYEE_PASSWORD_RESET)
                .subject("Password change in CRM Andersen")
                .args(args)
                .body("")
                .build();
        mailService.sendMail(RecipientDto.builder().contact(employee.getEmail()).build(), message);
    }

    @Override
    public Page<LdapUser> getPageableLdapUsers(String name, String email, Boolean isRegistered, Pageable pageable) {
        List<LdapUser> users = new ArrayList<>(crmLdapHelper.getAllUsers());
        ofNullable(isRegistered).ifPresent(value -> removeUsers(users, value));
        List<LdapUser> filteredUsers = users.stream()
                .filter(ldapUser -> isContains(name, ldapUser.getName()))
                .filter(ldapUser -> isContains(email, ldapUser.getEmail()))
                .sorted(getLdapComparator(pageable))
                .skip((long) pageable.getPageSize() * pageable.getPageNumber())
                .limit(pageable.getPageSize())
                .collect(Collectors.toList());
        return new PageImpl<>(filteredUsers, pageable, users.size());
    }

    private Comparator<LdapUser> getLdapComparator(Pageable pageable) {
        return ofNullable(pageable.getSort())
                .map(sort -> sort.getOrderFor("name"))
                .map(this::getDirectedComparator)
                .orElse(Comparator.comparing(LdapUser::getCreateDate).reversed());
    }

    private Comparator<LdapUser> getDirectedComparator(Sort.Order order) {
        return order.getDirection().isAscending() ?
                Comparator.comparing(LdapUser::getName) :
                Comparator.comparing(LdapUser::getName).reversed();
    }

    private boolean isContains(String arg, String objectArg) {
        return arg == null || containsIgnoreCase(objectArg, arg);
    }

    @Override
    @Transactional
    public String resetPassword(Long id) {
        Employee employee = employeeService.getEmployeeByIdOrThrowException(id);
        if (Boolean.TRUE.equals(employee.getMayDBAuth())) {
            notifyResetPassword(employee);
            return String.format("Ссылка для изменения пароля отправлена пользователю на почту %s.", employee.getEmail());
        } else {
            throw new CrmException(CHANGING_AD_PASS_MESSAGE);
        }
    }

    @Override
    public ChangePassDto checkToken(String tokenKey) {
        try {
            VerificationKey verificationKey = tokenService.findVerificationKeyByTokenKey(tokenKey);
            String login = tokenManager.getLogin(verificationKey.getToken());
            Employee employee = employeeService.findByLogin(login);

            return new ChangePassDto().setLogin(employee.getLogin()).setToken(verificationKey.getToken());
        } catch (ExpiredJwtException e) {
            log.info("Срок действия ссылки по ключу [{}] закончился.", tokenKey);
            throw new CrmException("Срок действия ссылки закончился. Обратитесь к администратору за новой.", e);
        }
    }

    @Override
    @Transactional
    public void changePassword(ChangePassDto passDto) {
        Assert.notNull(passDto, "Форма изменения пароля не должна быть NULL.");
        Assert.isTrue(passDto.getPass().length() >= 6 && passDto.getPass().length() <= 12,
                "Длина пароля не должен быть меньше 6 и больше 12 символов.");
        Assert.notNull(passDto.getTokenKey(), "Проверочный ключ не должн быть NULL.");

        Employee employee = employeeService.findByLogin(passDto.getLogin());
        if (Boolean.TRUE.equals(employee.getMayDBAuth())) {
            String encodedPassword = passwordEncoder.encode(passDto.getPass());
            employee.setPassword(encodedPassword);
            tokenService.deleteVerificationKey(passDto.getTokenKey());
        } else {
            log.warn("Сотруднику [{}] не возможно поменять пароль, он является LDAP user.");
            throw new CrmException(CHANGING_AD_PASS_MESSAGE);
        }
    }

    private void removeUsers(List<LdapUser> users, Boolean isRegistered) {
        List<Employee> employees = employeeService.getAll();
        Set<String> employeesEmail = employees.stream()
                .map(Employee::getEmail)
                .collect(Collectors.toSet());
        if (Boolean.TRUE.equals(isRegistered)) {
            users.removeIf(ldapUser -> !employeesEmail.contains(ldapUser.getEmail()));
        } else {
            users.removeIf(ldapUser -> employeesEmail.contains(ldapUser.getEmail()));
        }
    }

    private boolean isLdapUser(Employee employee, List<LdapUser> ldapUsers) {
        return ldapUsers.stream()
                .map(LdapUser::getEmail)
                .anyMatch(it -> Objects.equals(it, employee.getEmail()));
    }
}
