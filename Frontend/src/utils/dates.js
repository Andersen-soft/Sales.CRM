// @flow

import {
    format,
    parseISO,
} from 'date-fns';
import en from 'date-fns/locale/en-GB';
import ru from 'date-fns/locale/ru';
import getCurrentLanguage from 'crm-utils/getCurrentLanguage';
import { LOCALE_RU } from 'crm-constants/locale';

export const toFullIsoFormat = (value: string | Object) => value && new Date(value).toISOString();

export const getDate = (date: string | Date | null, formatStr: string): string => {
    if (!date) {
        return '';
    }

    const locale = getCurrentLanguage() === LOCALE_RU ? ru : en;

    return (typeof date === 'string')
        ? format(parseISO(date), formatStr, { locale })
        : format(date, formatStr, { locale });
};
