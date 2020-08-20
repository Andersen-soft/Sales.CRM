package com.andersenlab.crm.converter.socialnetworkanswer;

import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.Sex;
import com.andersenlab.crm.model.entities.Country;
import com.andersenlab.crm.model.entities.SocialNetworkAnswer;
import com.andersenlab.crm.model.entities.SocialNetworkUser;
import com.andersenlab.crm.model.entities.Source;
import com.andersenlab.crm.model.view.SocialNetworkAnswerSalesHeadView;
import com.andersenlab.crm.rest.dto.SocialNetworkAnswerHeadDto;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

import static com.andersenlab.crm.utils.ConverterHelper.getEmptyIfNull;
import static com.andersenlab.crm.utils.CrmReportUtils.replaceNullField;
import static com.andersenlab.crm.utils.SkypeBotHelper.getNullableFullName;

@Component
public class SocialNetworkAnswerToHeadDtoConverter implements Converter<SocialNetworkAnswerSalesHeadView, SocialNetworkAnswerHeadDto> {
    @Override
    public SocialNetworkAnswerHeadDto convert(SocialNetworkAnswerSalesHeadView source) {
        SocialNetworkAnswerHeadDto socialNetworkAnswerHeadDto = new SocialNetworkAnswerHeadDto();
        socialNetworkAnswerHeadDto.setId(source.getId());
        socialNetworkAnswerHeadDto.setStatus(getEmptyIfNull(source.getStatus(), SocialNetworkAnswer.Status::getName));
        socialNetworkAnswerHeadDto.setCreateDate(getEmptyIfNull(source.getCreateDate(), LocalDateTime::toString));
        socialNetworkAnswerHeadDto.setAssistant(getNullableFullName(source.getAssistant()));
        socialNetworkAnswerHeadDto.setAssistantId(getEmptyIfNull(source.getAssistant(), employee -> employee.getId().toString()));
        socialNetworkAnswerHeadDto.setResponsible(getNullableFullName(source.getResponsible()));
        socialNetworkAnswerHeadDto.setResponsibleId(getEmptyIfNull(source.getResponsible(), employee -> employee.getId().toString()));
        socialNetworkAnswerHeadDto.setSource(getEmptyIfNull(source.getSource(), Source::getName));
        socialNetworkAnswerHeadDto.setSocialNetworkContact(getEmptyIfNull(source.getSocialNetworkContact(),
                socialNetworkContact -> getEmptyIfNull(socialNetworkContact.getSocialNetworkUser(), SocialNetworkUser::getName)));
        socialNetworkAnswerHeadDto.setMessage(replaceNullField(source.getMessage()));
        socialNetworkAnswerHeadDto.setLinkLead(replaceNullField(source.getLinkLead()));
        socialNetworkAnswerHeadDto.setFirstName(replaceNullField(source.getFirstName()));
        socialNetworkAnswerHeadDto.setLastName(replaceNullField(source.getLastName()));
        socialNetworkAnswerHeadDto.setSex(getEmptyIfNull(source.getSex(), Sex::name));
        socialNetworkAnswerHeadDto.setCountry(getEmptyIfNull(source.getCountry(), Country::getNameRu));
        socialNetworkAnswerHeadDto.setCompanyName(replaceNullField(source.getCompanyName()));
        return socialNetworkAnswerHeadDto;
    }

    @Override
    public Class<SocialNetworkAnswerSalesHeadView> getSource() {
        return SocialNetworkAnswerSalesHeadView.class;
    }

    @Override
    public Class<SocialNetworkAnswerHeadDto> getTarget() {
        return SocialNetworkAnswerHeadDto.class;
    }
}
