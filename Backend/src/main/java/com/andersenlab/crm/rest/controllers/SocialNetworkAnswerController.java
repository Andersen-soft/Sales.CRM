package com.andersenlab.crm.rest.controllers;

import com.andersenlab.crm.aop.HasRole;
import com.andersenlab.crm.configuration.swagger.ApiPageable;
import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.model.entities.SocialNetworkAnswer;
import com.andersenlab.crm.model.view.SocialNetworkAnswerSalesHeadView;
import com.andersenlab.crm.rest.BaseResponse;
import com.andersenlab.crm.rest.dto.SocialAnswerDtoForm;
import com.andersenlab.crm.rest.dto.SocialNetworkAnswerHeadDto;
import com.andersenlab.crm.rest.facade.ReportFile;
import com.andersenlab.crm.rest.facade.SocialNetworkAnswerFacade;
import com.andersenlab.crm.rest.response.RatingNCForNCResponse;
import com.andersenlab.crm.rest.response.RatingNCResponse;
import com.andersenlab.crm.rest.response.SocialAnswerDto;
import com.andersenlab.crm.services.SocialNetworkAnswerService;
import com.querydsl.core.types.Predicate;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.querydsl.binding.QuerydslPredicate;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpEntity;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import static com.andersenlab.crm.model.RoleEnum.*;

@RestController
@RequestMapping("/social_answer")
@RequiredArgsConstructor
public class SocialNetworkAnswerController extends BaseController {

    private final SocialNetworkAnswerFacade socialNetworkAnswerFacade;
    private final SocialNetworkAnswerService socialNetworkAnswerService;
    private final ConversionService conversionService;
    private final ReportFile reportFile;

    @HasRole(roles = {ROLE_NETWORK_COORDINATOR})
    @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "Создание ответа соцсетей.", notes = "Поле \"sex\" принимает один из двух параметров: \"Мужской\", \"Женский\".\n" +
            "Входящих фильтрующих полей нет.")
    public BaseResponse<SocialAnswerDtoForm> createAnswer(@RequestBody @Valid SocialAnswerDtoForm request) {
        return new BaseResponse<>(socialNetworkAnswerFacade.create(request));
    }

    @HasRole(roles = {ROLE_SALES})
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiPageable
    @ApiOperation(value = "Получение ответов соцсетей для sales.",
            notes = "Обязательных полей нет.\n" +
                    "Возможные фильтры по полям:\n id - id ответа (прим. id=6)\n assistant - id aссистентa по продажам (прим. assistant=70189)\n" +
                    "companyName - название компании (прим. companyName=Protacon Group)\n country - id страны (прим. country=56)\n" +
                    "createDate - дата создания (прим. createDate=2019-04-23T12:02:02)\n email - емейл (прим. email=qwe@wer.gtuy)\n" +
                    "emailPrivate - личный емейл (прим. emailPrivate=mail@mail.ru)\n firstName - имя (прим. firstName=Мария)\n" +
                    "lastName - фамилия (прим. lastName=Морозов)\n linkLead - ссылка на соц. сеть(linkLead=https://www.linkedin.com/in/yvon-g-21094010/)\n" +
                    "message - сообщение ответa(прим. message=Thank you, please send me a power point about your company and services)\n" +
                    "phone - номер телефона(прим. phone=987654(123))\n phoneCompany - номер телефона компании(прим. phoneCompany=(812) 716-30-98)\n" +
                    "position - занимаемая должность (прим. position=test) search - поиск по данной строке(по всем полям прим. search=Inhaber)\n " +
                    "sex - пол (прим. sex=Мужской)\n site - сайт (site=http://1aqa.com)\n skype - скайп (прим. skype=testsk)\n " +
                    "socialNetworkContact - id контакта в социальной сети (socialNetworkContact=135)\n status - статус ответа (прим. status=Принято)\n" +
                    "Задание параметров отображения результата:\n page - номер страницы результатов (прим. page=9)\n" +
                    "size - количество записей на странице (прим. size=13)\n sort - сортировка (прим. sort=id,desc)")
    public BaseResponse<Page<SocialAnswerDto>> getSalesAnswers(
            @QuerydslPredicate(root = SocialNetworkAnswer.class) Predicate predicate,
            Pageable pageable, Locale locale
    ) {
        return new BaseResponse<>(conversionService.convertToPageWithLocale(
                pageable, socialNetworkAnswerService.findAll(predicate, pageable),SocialAnswerDto.class, locale));
    }

    @HasRole(roles = {ROLE_SALES_HEAD})
    @GetMapping(value = "/head", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiPageable
    @ApiOperation(value = "Получение ответов соцсетей для sales head, с возможность фильтрации",
            notes = "Обязательных полей нет.\n" +
                    "Возможные фильтры по полям:\n id - id ответа соцсетей (прим. id=552)\n assistant - id aссистентa по продажам (прим. assistant=70189)\n" +
                    "companyName - название компании(прим. companyName=Апполинариум)\n country - id страны(прим. country=51)\n" +
                    "createDate - дата создания ответа(прим. createDate=2019-07-16T07:41:22)\n firstName - имя(прим. firstName=Алеся)\n" +
                    "lastName - фамилия (прим. lastName=Иванова)\n linkLead - сылка на соц. сеть(linkLead=https://www.linkedin.com/in/yvon-g-21094010/)\n" +
                    "message - сообщение ответа (прим. message=Thank you, please send me a power point about your company and services)\n " +
                    "responsible - id ответственного сотрудника(прим. responsible=50)\n search - поиск по данной строке(по всем полям прим. search=Inhaber)\n" +
                    "sex - пол (прим. sex=Женский)\n socialNetworkContact - id контакта в социальной сети (socialNetworkContact=135)\n " +
                    "source - id источника (прим. source=12)\n  status - статус ответа (прим. status=Отклонено)\n" +
                    "Задание параметров отображения результата:\n page - номер страницы результатов (прим. page=9)\n" +
                    "size - количество записей на странице (прим. size=13)\n sort - сортировка (прим. sort=id,desc)")
    public BaseResponse<Page<SocialNetworkAnswerHeadDto>> getSalesHeadAnswers(
            @QuerydslPredicate(root = SocialNetworkAnswerSalesHeadView.class) Predicate predicate,
            Pageable pageable
    ) {
        Page<SocialNetworkAnswerSalesHeadView> answers = socialNetworkAnswerService.findSalesHeadViews(predicate, pageable);
        return new BaseResponse<>(conversionService.convertToPage(pageable, answers, SocialNetworkAnswerHeadDto.class));
    }

    @HasRole(roles = {ROLE_SALES_HEAD})
    @PostMapping(value = "/head_csv", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @ApiOperation(value = "Выгрузка ответов соцсетей для sales head в CSV, с возможностью фильтрации",
            notes = "Обязательных полей нет.\n" +
                    "Возможные фильтры по полям:\n id - id ответа соцсетей (прим. id=552)\n assistant - id aссистентa по продажам (прим. assistant=70189)\n" +
                    "companyName - название компании(прим. companyName=Апполинариум)\n country - id страны(прим. country=51)\n" +
                    "createDate - дата создания ответа(прим. createDate=2019-07-16T07:41:22)\n firstName - имя(прим. firstName=Алеся)\n" +
                    "lastName - фамилия (прим. lastName=Иванова)\n linkLead - сылка на соц. сеть(linkLead=https://www.linkedin.com/in/yvon-g-21094010/)\n" +
                    "message - сообщение ответа (прим. message=Thank you, please send me a power point about your company and services)\n " +
                    "responsible - id ответственного сотрудника(прим. responsible=50)\n search - поиск по данной строке(по всем полям прим. search=Inhaber)\n" +
                    "sex - пол (прим. sex=Женский)\n socialNetworkContact - id контакта в социальной сети (socialNetworkContact=135)\n " +
                    "source - id источника (прим. source=12)\n  status - статус ответа (прим. status=Отклонено)\n" +
                    "Задание параметров отображения результата:\n page - номер страницы результатов (прим. page=9)\n" +
                    "size - количество записей на странице (прим. size=13)\n sort - сортировка (прим. sort=id,desc)")
    public HttpEntity<byte[]> downloadReport(
            @QuerydslPredicate(root = SocialNetworkAnswerSalesHeadView.class) Predicate predicate
    ) {
        byte[] document = reportFile.getSocialAnswersReport(predicate);
        return new HttpEntity<>(document, defineHttpHeadersDownload("Social_network_answers_report.csv"));
    }

    @HasRole(roles = {ROLE_SALES})
    @PutMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "Изменение ответа соцсетей и перезапись его в БД",
            notes = "id - обязательное поле (прим. /552)")
    public BaseResponse<SocialAnswerDto> updateAnswer(
            @PathVariable("id") Long id,
            @RequestBody @Valid SocialAnswerDto answerDto
    ) {
        return new BaseResponse<>(socialNetworkAnswerFacade.updateAnswer(id, answerDto));
    }

    @HasRole(roles = {ROLE_SALES})
    @PostMapping(value = "/save", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "Сохранение ответов соцсетей.",
            notes = "Из данного списка(Body) ответ удаляется и переходит в дальнейшую обработку" +
            "Входящих фильтрующих полей нет")
    public BaseResponse saveAnswers(@RequestBody List<Long> ids) {
        socialNetworkAnswerFacade.saveAnswers(ids);
        return new BaseResponse<>();
    }

    @HasRole(roles = {ROLE_SALES})
    @PostMapping(value = "/reject", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "Отклонение ответов соцсетей.",
            notes = "Входящих фильтрующих полей нет")
    public BaseResponse rejectAnswers(@RequestBody List<Long> ids) {
        socialNetworkAnswerFacade.rejectAnswers(ids);
        return new BaseResponse<>();
    }

    @HasRole(roles = {ROLE_SALES_HEAD})
    @PostMapping(value = "/return", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "Возвращение ответов соцсетей обратно сейлзу.",
            notes = "Входящих фильтрующих полей нет")
    public BaseResponse returnAnswers(@RequestBody List<Long> ids) {
        socialNetworkAnswerFacade.returnAnswers(ids);
        return new BaseResponse<>();
    }

    @HasRole(roles = {ROLE_SALES_HEAD})
    @DeleteMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "Удаление ответа соцсетей.",
    notes = "id - обязательное поле (прим. /544).")
    public BaseResponse deleteAnswers(@PathVariable("id") Long id) {
        socialNetworkAnswerFacade.deleteAnswer(id);
        return new BaseResponse<>();
    }

    @HasRole(roles = {ROLE_SALES_HEAD})
    @GetMapping(value = "/stat", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "Получение статистики по ответам соцсетей.",
            notes = "createdFrom и createdTo - обязательные поля(в формате - \"yyyy-MM-dd\").\n" +
                    "(прим. createdFrom=2018-06-12&createdTo=2019-07-30)")
    public BaseResponse<Map<String, String>> getAnswersStatistic(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate createdFrom,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate createdTo
    ) {
        return new BaseResponse<>(socialNetworkAnswerService.getStatistic(createdFrom, createdTo));
    }

    @HasRole(roles = {ROLE_SALES_HEAD, ROLE_NETWORK_COORDINATOR, ROLE_SALES})
    @GetMapping("/get_statuses")
    @ApiOperation(value = "Получение уникальных значений статусов для фильтра по ответам из соц. сетей",
            notes = "Обязательных полей нет.\n" +
                    "Возможные фильтры по полям:\n id - id ответа соцсетей (прим. id=552)\n assistant - id aссистентa по продажам (прим. assistant=70189)\n" +
                    "companyName - название компании(прим. companyName=Апполинариум)\n country - id страны(прим. country=51)\n" +
                    "createDate - дата создания ответа(прим. createDate=2019-07-16T07:41:22)\n firstName - имя(прим. firstName=Алеся)\n" +
                    "lastName - фамилия (прим. lastName=Иванова)\n linkLead - сылка на соц. сеть(linkLead=https://www.linkedin.com/in/yvon-g-21094010/)\n" +
                    "message - сообщение ответа (прим. message=Thank you, please send me a power point about your company and services)\n " +
                    "responsible - id ответственного сотрудника(прим. responsible=50)\n search - поиск по данной строке(по всем полям прим. search=Inhaber)\n" +
                    "sex - пол (прим. sex=Женский)\n socialNetworkContact - id контакта в социальной сети (socialNetworkContact=135)\n " +
                    "source - id источника (прим. source=12)\n  status - статус ответа (прим. status=Отклонено)\n" +
                    "Задание параметров отображения результата:\n page - номер страницы результатов (прим. page=9)\n" +
                    "size - количество записей на странице (прим. size=13)\n sort - сортировка (прим. sort=id,desc)")
    public BaseResponse<List<String>> getStatuses(
            @QuerydslPredicate(root = SocialNetworkAnswerSalesHeadView.class) Predicate predicate,
            Pageable pageable
    ) {
        return new BaseResponse<>(socialNetworkAnswerService.getStatuses(predicate, pageable));
    }

    @HasRole(roles = {ROLE_NETWORK_COORDINATOR})
    @GetMapping (value = "/get_ratings_nc_for_nc", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "Получение показателей NC для NC",
            notes = "Обязательных полей нет.\n" +
                    "Задание параметров отображения результата:\n page - номер страницы результатов (прим. page=9)\n" +
                    "size - количество записей на странице (прим. size=13)\n sort - сортировка (прим. sort=id,desc)")
    public BaseResponse<Page<RatingNCForNCResponse>> getRatingsNCforNC(Pageable pageable) {
        return new BaseResponse<>(socialNetworkAnswerService.getRatingsNCforNC(pageable));
    }

    @HasRole(roles = {ROLE_SALES_HEAD})
    @GetMapping (value = "/get_ratings_nc", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "Получение показателей NC для Head of Sales",
            notes = "createdFrom и createdTo - обязательные поля(в формате - \"yyyy-MM-dd\").\n" +
                    "(прим. createdFrom=2018-06-12&createdTo=2019-07-30)\n" +
                    "Задание параметров отображения результата:\n page - номер страницы результатов (прим. page=9)\n" +
                    "size - количество записей на странице (прим. size=13)\n sort - сортировка (прим. sort=id,desc)")
    public BaseResponse<Page<RatingNCResponse>> getRatingsNC(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate createdFrom,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate createdTo,
            Pageable pageable
    ) {
        return new BaseResponse<>(socialNetworkAnswerService.getRatingsNC(createdFrom, createdTo, pageable));
    }

    @HasRole(roles = {ROLE_SALES_HEAD})
    @GetMapping(value = "/ratings_nc_csv", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public HttpEntity<byte[]> downloadRatings (
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate createdFrom,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate createdTo,
            Sort sort
    ) {
        byte[] document = reportFile.getRatingsNCReport(createdFrom, createdTo, sort);
        return new HttpEntity<>(document, defineHttpHeadersDownload("Ratings_nc_report.csv"));
    }
}
