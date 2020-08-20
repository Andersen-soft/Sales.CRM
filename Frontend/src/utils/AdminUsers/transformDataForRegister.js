// @flow

import { omit, path } from 'ramda';
import { SALE_ASSISTANT_ID } from 'crm-constants/roles';

const omitMentorField = omit(['mentor']);

// TODO refactor this function

export default (
    values: Object,
    isLdapUser?: boolean,
    isEdit: boolean = false,
) => {
    const data = { ...values };
    const keys = Object.keys(values);

    data.roles = Array.isArray(data.roles)
        ? data.roles.map(({ value }) => value)
        : [data.roles.value];

    const mentorDataFormat = (acc, key) => {
        if (
            typeof data[key] !== 'object'
            || !(path(['mentor', 'value'], data) || path(['mentor', 'id'], data))
            || !data.roles.some(role => role === SALE_ASSISTANT_ID)
        ) {
            return { ...omitMentorField(acc) };
        }
        return {
            ...acc,
            mentorId: data[key].value ? data[key].value : data[key].id,
        };
    };

    return keys.reduce((acc, key) => {
        if (key === 'status') {
            if (typeof data[key] !== 'object') {
                return { ...acc };
            }
            return { ...acc, isActive: !!data[key].value };
        }

        if (key === 'mentor') {
            return mentorDataFormat(acc, key);
        }

        if (key === 'additionalEmails') {
            return {
                ...acc,
                [key]: data[key].filter(email => email),
            };
        }

        if (isEdit && isLdapUser && (key === 'login' || key === 'email')) {
            return {
                ...acc,
                [key]: null,
            };
        }
        if (!isEdit && data[key] === '') {
            return {
                ...acc,
                [key]: null,
            };
        }
        return {
            ...acc,
            [key]: data[key],
        };
    }, {});
};
