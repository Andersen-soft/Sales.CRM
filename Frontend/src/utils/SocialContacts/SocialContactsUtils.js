// @flow

import { isNil, pathOr } from 'ramda';
import {
    SOCIAL_CONTACTS_COLUMNS,
    SocialContactsHeaders,
} from 'crm-constants/reportBySocialContactsPage/socialContactsConstants';
import type { SocialAnswer } from 'crm-components/reportBySocialContactsPage/reportBySocialContacts';
import { getDate } from 'crm-utils/dates';
import { FULL_DATE_DS } from 'crm-constants/dateFormat';

const NEW_COMPANY_ID = -1;

export const setActiveColumnsFromConstant = () => {
    if (!localStorage.getItem(SOCIAL_CONTACTS_COLUMNS)) {
        localStorage.setItem(SOCIAL_CONTACTS_COLUMNS, JSON.stringify(SocialContactsHeaders));
    }
};

export const checkActiveColumnsVersion = () => {
    const SOCIAL_TABLE_COLUMNS_JSON = localStorage.getItem(SOCIAL_CONTACTS_COLUMNS);
    const SOCIAL_TABLE_COLUMNS = SOCIAL_TABLE_COLUMNS_JSON
        ? JSON.parse(SOCIAL_TABLE_COLUMNS_JSON)
        : SocialContactsHeaders;

    if (!isNil(SOCIAL_TABLE_COLUMNS)
        && SocialContactsHeaders.version !== SOCIAL_TABLE_COLUMNS.version) {
        localStorage.removeItem(SOCIAL_CONTACTS_COLUMNS);
        setActiveColumnsFromConstant();
    }
};
export const transformDataBeforeSave = (socialAnswer: SocialAnswer | {}) => ({
    id: pathOr(null, ['id'], socialAnswer),
    company: {
        id: pathOr(NEW_COMPANY_ID, ['company', 'id'], socialAnswer),
        name: pathOr(null, ['company', 'name'], socialAnswer),
        phone: pathOr(null, ['company', 'phone'], socialAnswer),
        site: pathOr(null, ['company', 'site'], socialAnswer),
    },
    country: pathOr(null, ['country'], socialAnswer),
    created: pathOr(null, ['created'], socialAnswer),
    email: pathOr(null, ['email'], socialAnswer),
    emailPrivate: pathOr(null, ['emailPrivate'], socialAnswer),
    firstName: pathOr(null, ['firstName'], socialAnswer),
    lastName: pathOr(null, ['lastName'], socialAnswer),
    linkLead: pathOr(null, ['linkLead'], socialAnswer),
    message: pathOr(null, ['message'], socialAnswer),
    phone: pathOr(null, ['phone'], socialAnswer),
    phoneCompany: pathOr(null, ['company', 'phone'], socialAnswer),
    position: pathOr(null, ['position'], socialAnswer),
    sex: pathOr(null, ['sex'], socialAnswer),
    skype: pathOr(null, ['skype'], socialAnswer),
    dateOfBirth: getDate(pathOr(null, ['dateOfBirth'], socialAnswer), FULL_DATE_DS) || '',
});

export const checkInstanceErrors = (obj: Object) => {
    const values = Object.values(obj);

    return values.find(value => value instanceof Error);
};
