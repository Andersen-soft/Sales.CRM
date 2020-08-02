package com.andersenlab.crm.services.impl;

import com.andersenlab.crm.configuration.properties.PasswordGeneratorProperties;
import com.andersenlab.crm.services.PasswordGenerateService;
import lombok.RequiredArgsConstructor;
import org.passay.CharacterData;
import org.passay.CharacterRule;
import org.passay.EnglishCharacterData;
import org.passay.PasswordGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PasswordGenerateImpl implements PasswordGenerateService {

    @Autowired
    private final PasswordGeneratorProperties passayProperties;

    @Override
    public String generatePassayPassword() {
        PasswordGenerator gen = new PasswordGenerator();

        CharacterRule lowerCaseRule = new CharacterRule(EnglishCharacterData.LowerCase,
                passayProperties.getLowerCaseCharacters());

        CharacterRule upperCaseRule = new CharacterRule(EnglishCharacterData.UpperCase,
                passayProperties.getUpperCaseCharacters());

        CharacterRule digitRule = new CharacterRule(EnglishCharacterData.Digit,
                passayProperties.getNumberOfDigits());

        CharacterRule splCharRule = new CharacterRule(new CharacterData() {
            @Override
            public String getCharacters() {
                return "!\"#$%&'()*+,-.^";
            }

            @Override
            public String getErrorCode() {
                return null;
            }
        }, passayProperties.getSpecialChars());

        return gen.generatePassword(passayProperties.getLengthPassword(), splCharRule, lowerCaseRule,
                upperCaseRule, digitRule);
    }
}
