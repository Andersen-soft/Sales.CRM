// @flow

import { USER_SESSION_DATA } from 'crm-constants/authConstants';
import { LOCALE_EN, LOCALE_RU } from 'crm-constants/locale';

const getCurrentLanguage = () => {
    const userSessionData = JSON.parse(String(localStorage.getItem(USER_SESSION_DATA)));

    let language = userSessionData && userSessionData.employeeLang
        ? userSessionData.employeeLang
        : navigator.language.split(/[-_]/)[0];

    if (language !== LOCALE_RU && language !== LOCALE_EN) {
        language = LOCALE_EN;
    }

    return language;
};

export default getCurrentLanguage;
