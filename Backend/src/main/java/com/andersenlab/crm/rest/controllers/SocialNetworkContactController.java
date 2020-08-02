package com.andersenlab.crm.rest.controllers;

import com.andersenlab.crm.aop.HasRole;
import com.andersenlab.crm.configuration.swagger.ApiPageable;
import com.andersenlab.crm.rest.BaseResponse;
import com.andersenlab.crm.rest.DtoResponse;
import com.andersenlab.crm.rest.dto.SocialNetworkContactDto;
import com.andersenlab.crm.rest.facade.SocialNetworkContactFacade;
import com.andersenlab.crm.rest.resolvers.CrmPredicate;
import com.andersenlab.crm.rest.resolvers.SocialNetworkContactPredicateResolver;
import com.andersenlab.crm.rest.response.SourceDto;
import com.querydsl.core.types.Predicate;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.andersenlab.crm.model.RoleEnum.ROLE_ADMIN;
import static com.andersenlab.crm.model.RoleEnum.ROLE_HR;
import static com.andersenlab.crm.model.RoleEnum.ROLE_MANAGER;
import static com.andersenlab.crm.model.RoleEnum.ROLE_NETWORK_COORDINATOR;
import static com.andersenlab.crm.model.RoleEnum.ROLE_RM;
import static com.andersenlab.crm.model.RoleEnum.ROLE_SALES;
import static com.andersenlab.crm.model.RoleEnum.ROLE_SALES_HEAD;
import javax.validation.Valid;
import java.util.List;
import java.util.Locale;

@RestController
@RequestMapping("/social_contact")
@RequiredArgsConstructor
public class SocialNetworkContactController extends BaseController {

    private final SocialNetworkContactFacade socialNetworkContactFacade;

    @HasRole(roles = ROLE_SALES_HEAD)
    @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "Создание контакта социальных сетей",
            notes = "Входящих фильтрующих полей нет.")
    public BaseResponse<DtoResponse<SocialNetworkContactDto>> createContact(@RequestBody @Valid SocialNetworkContactDto request) {
        return new BaseResponse<>(socialNetworkContactFacade.create(request));
    }


    @HasRole(roles = ROLE_SALES_HEAD)
    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "Получение контакта социальных сетей по id.",
            notes = "id - обязательное поле (прим. /4).")
    public BaseResponse<SocialNetworkContactDto> getContact(@PathVariable("id") Long id) {
        return new BaseResponse<>(socialNetworkContactFacade.getById(id));
    }


    @HasRole(roles = {ROLE_ADMIN, ROLE_SALES_HEAD, ROLE_HR, ROLE_MANAGER, ROLE_RM, ROLE_SALES, ROLE_NETWORK_COORDINATOR})
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiPageable
    @ApiOperation(value = "Получение контактов соцсетей с возможностью фильтрации",
            notes = "Обязательных полей нет.\n" +
                    "Возможные фильтры по полям:\n id - id контакта (прим. id=4)\n searchQuery -поиск по данной строке(прим. searchQuery=Ходько)\n" +
                    "socialNetworkUser.name - имя пользователя соц. сети(прим. socialNetworkUser.name=Aleksandr Mardanov)\n " +
                    "salesAssistant.id - id aссистентa по продажам (прим. salesAssistant.id=70189)\n salesAssistant.login - логин aссистентa по продажам (прим. salesAssistant.login=e.pilipenko)\n" +
                    "sales.id - id сотрудника ответственного за продажу (прим. sales.id=87)\n sales.login - логин сотрудника ответственного за продажу(прим. sales.login=d.akishina)\n" +
                    "socialAnswer.status - статусы ответов(Возможен множественный выбор прим. socialAnswer.status=Принято&role=4&socialAnswer.status=Отклонено)\n" +
                    "socialAnswer.createDate - дата создания ответа(Возможен множественный выбор прим. createDate=2019-05-03 07:49:07&createDate=2019-03-22T07:03:51)\n" +
                    "socialAnswer.assistant - id ассисента (прим. socialAnswer.assistant=70002)\n" +
                    "socialAnswer.responsible - id ответственного сотрудника (прим. socialAnswer.responsible=70176)\n" +
                    "socialAnswer.source - id источника(Возможен множественный выбор прим. socialAnswer.source=13&socialAnswer.source=5)" +
                    "socialAnswer.socialContact - id социального контакта (прим. socialAnswer.socialContact=149)\n" +
                    "socialAnswer.country - id странны (прим. socialAnswer.country=36)\n" +
                    "socialAnswer.search - поиск по данной строке (прим. socialAnswer.search=IP Partners)\n" +
                    "Задание параметров отображения результата:\n page - номер страницы результатов (прим. page=9)\n" +
                    "size - количество записей на странице (прим. size=13)\n sort - сортировка (прим. sort=id,desc)")
    public BaseResponse<Page<SocialNetworkContactDto>> getAll(
            @CrmPredicate(resolver = SocialNetworkContactPredicateResolver.class) Predicate predicate,
            Pageable pageable, Locale locale) {
        return new BaseResponse<>(socialNetworkContactFacade.getAll(predicate, pageable, locale));
    }

    @HasRole(roles = ROLE_SALES_HEAD)
    @GetMapping(path = "/sources")
    @ApiOperation(value = "Получение списка источников",
            notes = "Входящих полей нет")
    public BaseResponse<List<SourceDto>> getSources() {
        return new BaseResponse<>(socialNetworkContactFacade.getSocialNetworkSources());
    }

    @HasRole(roles = ROLE_SALES_HEAD)
    @PutMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "Изменение контакта соцсетей и перезапись его в БД",
            notes = "id - обязательное поле (прим. /4).")
    public BaseResponse<SocialNetworkContactDto> updateAnswer(
            @PathVariable("id") Long id,
            @RequestBody @Valid SocialNetworkContactDto dto) {
        return new BaseResponse<>(socialNetworkContactFacade.update(id, dto));
    }

    @HasRole(roles = ROLE_SALES_HEAD)
    @DeleteMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "Удаление контакта соцсети по id",
            notes = "id - обязательное поле (прим. /4).")
    public BaseResponse deleteAnswers(
            @ApiParam(value = "For example: 1")
            @PathVariable("id") Long id) {
        socialNetworkContactFacade.delete(id);
        return new BaseResponse<>();
    }
}
