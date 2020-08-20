// @flow

import { CRM_DATETIME_FORMAT_CAPITAL_MONTH } from 'crm-constants/dateFormat';
import { getDate } from 'crm-utils/dates';

export default (date: string) => (
    date
        ? getDate(date, CRM_DATETIME_FORMAT_CAPITAL_MONTH)
        : 'Отсутствует'
);
