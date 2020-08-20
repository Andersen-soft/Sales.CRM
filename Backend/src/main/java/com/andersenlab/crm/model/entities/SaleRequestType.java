package com.andersenlab.crm.model.entities;

import com.andersenlab.crm.model.Nameable;
import lombok.AllArgsConstructor;

import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.ResourceBundle;
import java.util.stream.Collectors;

import static com.andersenlab.crm.services.i18n.I18nConstants.BUNDLE_NAME;
import static com.andersenlab.crm.services.i18n.I18nConstants.LANGUAGE_TAG_EN;
import static com.andersenlab.crm.services.i18n.I18nConstants.LANGUAGE_TAG_RU;

@AllArgsConstructor
public enum SaleRequestType implements Nameable {
    ESTIMATION("companySale.requestType.estimation"),
    RESUME("companySale.requestType.resume"),
    RESUME_ESTIMATION("companySale.requestType.resumeEstimation"),
    NONE("companySale.requestType.none");

    private final String type;

    @Override
    public String getName() {
        return type;
    }

    public static List<SaleRequestType> defineStatuses(String value) {
        Locale localeRu = Locale.forLanguageTag(LANGUAGE_TAG_RU);
        Locale localeEn = Locale.forLanguageTag(LANGUAGE_TAG_EN);

        ResourceBundle bundleRu = ResourceBundle.getBundle(
                BUNDLE_NAME, localeRu);
        ResourceBundle bundleEn = ResourceBundle.getBundle(
                BUNDLE_NAME, localeEn);

        return Arrays.stream(SaleRequestType.values())
                .filter(s -> bundleEn.getString(s.getName())
                        .toUpperCase()
                        .contains(value.toUpperCase())
                        || bundleRu.getString(s.getName())
                        .toUpperCase()
                        .contains(value.toUpperCase()))
                .collect(Collectors.toList());
    }
}
