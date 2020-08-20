package com.andersenlab.crm.services.i18n;

import java.util.List;
import java.util.Locale;

/**
 * Internationalization service interface.
 */
public interface I18nService {
    /**
     * Gets base localized message by its key, without any additional formatting.
     *
     * @param key    Key value to look this message for.
     * @param locale Locale to translate this message.
     * @return Translated message.
     */
    String getLocalizedMessage(String key, Locale locale);

    /**
     * Gets the list of specified message in all available languages, by message key.
     *
     * @param key Key value to look this message for.
     * @return List of translated messages.
     */
    List<String> getMessagesByKey(String key);
}
