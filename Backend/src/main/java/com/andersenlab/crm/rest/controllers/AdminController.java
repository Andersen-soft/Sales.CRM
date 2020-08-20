package com.andersenlab.crm.rest.controllers;

import com.andersenlab.crm.aop.HasRole;
import com.andersenlab.crm.configuration.swagger.ApiPageable;
import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.model.LdapUser;
import com.andersenlab.crm.rest.BaseResponse;
import com.andersenlab.crm.rest.dto.ChangePassDto;
import com.andersenlab.crm.rest.request.EmployeeCreateRequest;
import com.andersenlab.crm.rest.request.SaleDistributionTimeUpdateRequest;
import com.andersenlab.crm.rest.response.EmployeeResponse;
import com.andersenlab.crm.rest.response.SaleDistributionTimeResponse;
import com.andersenlab.crm.services.AdminService;
import com.andersenlab.crm.services.CompanySaleTempService;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

import static com.andersenlab.crm.model.RoleEnum.ROLE_ADMIN;
import static com.andersenlab.crm.model.RoleEnum.ROLE_HR;
import static com.andersenlab.crm.model.RoleEnum.ROLE_MANAGER;
import static com.andersenlab.crm.model.RoleEnum.ROLE_NETWORK_COORDINATOR;
import static com.andersenlab.crm.model.RoleEnum.ROLE_RM;
import static com.andersenlab.crm.model.RoleEnum.ROLE_SALES;
import static com.andersenlab.crm.model.RoleEnum.ROLE_SALES_ASSISTANT;
import static com.andersenlab.crm.model.RoleEnum.ROLE_SALES_HEAD;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final ConversionService conversionService;

    private final CompanySaleTempService companySaleTempService;

    @HasRole(roles = ROLE_ADMIN)
    @GetMapping(path = "/ldap_users")
    @ApiPageable
    @ApiOperation(value = "Получение списка всех пользователей",
            notes = "Обязательных полей нет.\n" +
                    "Возможные фильтры по полям:\n name - имя пользователя (прим. name=Sergii Shorkin)\n email - емейл пользователя (прим. email=n.zonov@andersenlab.com)\n" +
                    "isRegistered - регистрирован (прим. isRegistered=true)\n" +
                    "Задание параметров отображения результата:\n page - номер страницы результатов (прим. page=9)\n" +
                    "size - количество записей на странице (прим. size=13)\n sort - сортировка (прим. sort=id,desc)")
    public BaseResponse<Page<LdapUser>> getAllUsers(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) Boolean isRegistered,
            Pageable pageable
    ) {
        return new BaseResponse<>(adminService.getPageableLdapUsers(name, email, isRegistered, pageable));
    }

    @HasRole(roles = ROLE_ADMIN)
    @PostMapping(path = "/register")
    @ApiOperation(value = "Создание нового пользователя",
            notes = "Входящих фильтрующих полей нет.")
    public BaseResponse<EmployeeResponse> registerInCrm(@RequestBody @Valid EmployeeCreateRequest employeeCreateRequest) {
        return new BaseResponse<>(conversionService.convert(adminService.registerInCrm(employeeCreateRequest), EmployeeResponse.class));
    }

    @HasRole(roles = ROLE_ADMIN)
    @GetMapping("/reset_password")
    @ApiOperation(value = "Сбросить пароль по данному id.",
            notes = "Обязательное поле id(прим. id=736)")
    public BaseResponse<String> resetPassword(@RequestParam Long id) {
        return new BaseResponse<>(adminService.resetPassword(id));
    }

    @PostMapping(path = "/check-token")
    @ApiOperation(value = "Проверить токен",
            notes = "Входящих фильтрующих полей нет.")
    public BaseResponse<ChangePassDto> checkToken(@RequestBody String token) {
        return new BaseResponse<>(adminService.checkToken(token));
    }

    @HasRole(roles = {ROLE_ADMIN, ROLE_SALES_HEAD, ROLE_SALES, ROLE_MANAGER, ROLE_RM, ROLE_HR, ROLE_SALES_ASSISTANT, ROLE_NETWORK_COORDINATOR})
    @PostMapping(path = "/change-password")
    @ApiOperation(value = "Измененить и сохранить пароль",
            notes = "Входящих фильтрующих полей нет.")
    public BaseResponse changePassword(@RequestBody ChangePassDto passDto) {
        adminService.changePassword(passDto);
        return new BaseResponse<>();
    }

    @HasRole(roles = ROLE_ADMIN)
    @GetMapping(path = "/sale_distribution_time")
    @ApiOperation(value = "Получить время для дневного распределения продаж",
            notes = "Эндпоинт для тестирования. По умолчанию время всегда стоит с 9:00 до 18:00," +
                    " и правки при перезапуске приложения не сохраняются.")
    public BaseResponse<SaleDistributionTimeResponse> getCompanySaleDayDistributionTime() {
        return new BaseResponse<>(companySaleTempService.getDayDistributionTime());
    }

    @HasRole(roles = ROLE_ADMIN)
    @PostMapping(path = "/sale_distribution_time/update")
    @ApiOperation(value = "Изменить время для дневного распределения продаж",
            notes = "Эндпоинт для тестирования. По умолчанию время всегда стоит с 9:00 до 18:00," +
                    " и правки при перезапуске приложения не сохраняются.")
    public BaseResponse updateCompanySaleDayDistributionTime(@RequestBody SaleDistributionTimeUpdateRequest request) {
        companySaleTempService.updateDayDistributionTime(request.getFrom(), request.getTo());
        return new BaseResponse();
    }
}
