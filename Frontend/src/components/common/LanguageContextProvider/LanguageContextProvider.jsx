// @flow

import React, { useState } from 'react';
import type { Node } from 'react';

import { IntlProvider, addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import ru from 'react-intl/locale-data/ru';
import { flattenMessages } from 'crm-i18n/utils';
import translations from 'crm-i18n/locales';
import getCurrentLanguage from 'crm-utils/getCurrentLanguage';
import { USER_SESSION_DATA } from 'crm-constants/authConstants';
import { LOCALE_RU, LOCALE_EN } from 'crm-constants/locale';
import { changeUser } from 'crm-api/UserInfoService';

type Props = { children: Node };

addLocaleData([...en, ...ru]);

const IsLanguageContext = React.createContext < Object > (false);

const LanguageContextProvider = ({ children }: Props) => {
    const [locale, setLocale] = useState(getCurrentLanguage());
    const [messages, setMessages] = useState(flattenMessages(translations[locale]));

    const switchLanguage = () => {
        const currentUserSessionData = JSON.parse(String(localStorage.getItem(USER_SESSION_DATA))) || {};

        if (locale === LOCALE_RU) {
            setLocale(LOCALE_EN);
            setMessages(flattenMessages(translations.en));
            currentUserSessionData.employeeLang = LOCALE_EN;
            changeUser(currentUserSessionData.id, { employeeLang: LOCALE_EN });
        } else {
            setLocale(LOCALE_RU);
            setMessages(flattenMessages(translations.ru));
            currentUserSessionData.employeeLang = LOCALE_RU;
            changeUser(currentUserSessionData.id, { employeeLang: LOCALE_RU });
        }

        localStorage.setItem(USER_SESSION_DATA, JSON.stringify(currentUserSessionData));
    };

    return (
        <IsLanguageContext.Provider value={{ switchLanguage, locale }}>
            <IntlProvider
                key={locale}
                locale={locale}
                messages={messages}
                defaultLocale={LOCALE_EN}
            >
                {children}
            </IntlProvider>
        </IsLanguageContext.Provider>
    );
};

export { IsLanguageContext };
export default LanguageContextProvider;
