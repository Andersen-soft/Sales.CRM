package com.andersenlab.crm.configuration;

import com.andersenlab.crm.model.entities.SocialNetworkAnswer;
import com.andersenlab.crm.utils.CrmLocalDateUtils;
import org.modelmapper.Conditions;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;

@Configuration
public class ModelMapperConfig {

    @Bean
    public ModelMapper getModelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.getConfiguration()
                .setMatchingStrategy(MatchingStrategies.STRICT)
                .setPropertyCondition(Conditions.isNotNull());

        modelMapper.createTypeMap(String.class, String.class)
                .setConverter(ctx -> "".equals(ctx.getSource()) ? null : ctx.getSource());
        modelMapper.createTypeMap(String.class, LocalDate.class)
                .setConverter(ctx -> CrmLocalDateUtils.convertStringToLocalDate(ctx.getSource()));
        modelMapper.createTypeMap(SocialNetworkAnswer.class, SocialNetworkAnswer.class)
                .addMappings(mapping -> mapping.skip(SocialNetworkAnswer::setCountry))
                .addMappings(mapping -> mapping.skip(SocialNetworkAnswer::setDateOfBirth))
                .addMappings(mapping -> mapping.skip(SocialNetworkAnswer::setId))
                .addMappings(mapping -> mapping.skip(SocialNetworkAnswer::setAssistant))
                .addMappings(mapping -> mapping.skip(SocialNetworkAnswer::setDateOfBirth))
                .addMappings(mapping -> mapping.skip(SocialNetworkAnswer::setSocialNetworkContact))
                .addMappings(mapping -> mapping.skip(SocialNetworkAnswer::setSource));

        return modelMapper;
    }
}
