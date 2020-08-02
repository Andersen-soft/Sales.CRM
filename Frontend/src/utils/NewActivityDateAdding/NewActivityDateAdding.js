// @flow

import { CRM_FULL_DATE_SERVER_FORMAT, CRM_DATE_FORMAT } from 'crm-constants/dateFormat';
import { getDate } from 'crm-utils/dates';
import { isAfter, startOfDay } from 'date-fns';

const getErrors = ({
    activityTypes,
    contacts,
    comment,
    nextActivityDate,
    activityDate,
}: *) => ({
    activityTypesError: activityTypes.filter(({ checked }) => checked).length < 1,
    contactsError: contacts.filter(({ checked }) => checked).length < 1,
    commentError: !comment,
    nextActivityDateError: !nextActivityDate || isAfter(startOfDay(new Date()), nextActivityDate),
    activityDateError: activityDate > getDate(new Date(), CRM_FULL_DATE_SERVER_FORMAT),
});

const getNextActivityDay = (nextActivityDate: Date) => {
    const date = getDate(nextActivityDate, CRM_FULL_DATE_SERVER_FORMAT);

    return getDate(date, CRM_DATE_FORMAT);
};

export {
    getErrors,
    getNextActivityDay,
};
