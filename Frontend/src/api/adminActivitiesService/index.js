// @flow

import qs from 'qs';
import crmRequest from 'crm-helpers/api/crmRequest';

const URL_GET_ACTIVITIES = '/activity/get_activities';
const DEFAULT_SORT = 'dateActivity,desc';
const URL_GET_EMPLOYEE = '/employee/get_employee';
const SIZE = 50;

const getUsersActivities = (
    responsible: number,
    search: string,
    dateActivity: Array<string>,
    page: number = 0,
): Promise<boolean> => crmRequest({
    url: URL_GET_ACTIVITIES,
    method: 'GET',
    params: {
        responsible,
        size: SIZE,
        page,
        search,
        dateActivity,
        sort: DEFAULT_SORT,
    },
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
});

const getUser = (id: number): Promise<Object> => crmRequest({
    url: URL_GET_EMPLOYEE,
    method: 'GET',
    params: {
        id,
    },
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
});

export { getUsersActivities, getUser };

