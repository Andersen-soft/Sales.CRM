// @flow

import crmRequest from 'crm-helpers/api/crmRequest';

const URL_GET_ACTIVITIES: string = '/activity/get_activities';
const URL_GET_TYPES: string = '/activity/get_types';
const URL_UPDATE_ACTIVITY: string = '/activity/update_activity';
const URL_DELETE_ACTIVITY: string = '/activity/delete_activity';
const URL_GET_CONTACTS: string = '/contact/get_contacts';
const URL_SEARCH_ACTIVITY: string = '/activity/search';

type updateActivityData = {
    contacts: Array<string>;
    dateActivity: string;
    description: string;
    id?: number;
    responsibleName?: string;
    types: Array<string>;
}

export const getActivitiesHistory = (saleId: number, size: number, page: number) => crmRequest({
    url: URL_GET_ACTIVITIES,
    method: 'GET',
    params: {
        companySale: saleId,
        size,
        page,
        sort: 'dateActivity,desc',
    },
});

export const getTypes = () => crmRequest({
    url: URL_GET_TYPES,
    method: 'GET',
});

export const updateActivity = (activityId: number, data: updateActivityData) => crmRequest({
    url: URL_UPDATE_ACTIVITY,
    method: 'PUT',
    params: { id: activityId },
    data,
    headers: { 'content-type': 'application/json' },
});

export const deleteActivity = (activityId: number) => crmRequest({
    url: URL_DELETE_ACTIVITY,
    method: 'DELETE',
    params: { id: activityId },
    headers: { 'content-type': 'application/json' },
});

export const getActivityContacts = (companyId: number) => crmRequest({
    url: URL_GET_CONTACTS,
    method: 'GET',
    params: { company: companyId },
});

export const getSearchActivity = (searchData: string, saleId: number, size: number, canceled?: boolean = false) => crmRequest({
    url: URL_SEARCH_ACTIVITY,
    method: 'GET',
    params: {
        query: searchData,
        companySale: saleId,
        size,
        sort: 'dateActivity,desc',
    },
}, canceled);
