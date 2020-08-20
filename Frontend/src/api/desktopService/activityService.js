// @flow

import crmRequest from 'crm-helpers/api/crmRequest';

export type addActivityArguments = {
    companySaleId: number,
    contacts: Array<number>,
    dateActivity: string,
    description: string,
    types: Array<string>,
};

const URL_UPDATE_ACTIVITY: string = '/activity/update_activity';
const URL_CREATE_ACTIVITY: string = '/activity/create_activity';
const URL_GET_ACTIVITIES: string = '/activity/get_activities';

export const updateActivity = (id: number, nextActivityDate: string) => crmRequest({
    url: URL_UPDATE_ACTIVITY,
    method: 'PUT',
    params: { id },
    data: { nextActivityDate },
    headers: { 'content-type': 'application/json' },
});

export const addActivity = ({
    companySaleId,
    contacts,
    dateActivity,
    description,
    types,
}: addActivityArguments) => crmRequest({
    url: URL_CREATE_ACTIVITY,
    method: 'POST',
    data: {
        companySaleId,
        contacts,
        dateActivity,
        description,
        types,
    },
    headers: { 'content-type': 'application/json' },
});

export const getActivities = ({ companySale }: { companySale: number }) => (crmRequest({
    url: URL_GET_ACTIVITIES,
    method: 'GET',
    params: { companySale, size: 100, sort: 'dateActivity,desc' },
}));
