// @flow

import { useContext } from 'react';
import { IsLanguageContext } from 'crm-components/common/LanguageContextProvider/LanguageContextProvider';
import { flattenMessages } from 'crm-i18n/utils';
import translations from 'crm-i18n/locales';

export const useTranslation = (name: string) => {
    const { locale } = useContext(IsLanguageContext);

    return flattenMessages(translations[locale])[name];
};
