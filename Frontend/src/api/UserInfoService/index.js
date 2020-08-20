// @flow

import crmRequest from 'crm-helpers/api/crmRequest';

const URL_GET_USER = '/employee/get_employee';
const URL_CHANGE_USER = '/employee/update_employee';

const getUser = (id: number) => crmRequest({
    url: URL_GET_USER,
    method: 'GET',
    params: { id },
});

type dataType = {
    additionalInfo?: string,
    firstName?: string,
    lastName?: string,
    position?: string,
    skype?: string,
    employeeLang?: string,
}

const changeUser = (userId: number, data: dataType) => crmRequest({
    url: URL_CHANGE_USER,
    method: 'PUT',
    params: { id: userId },
    data,
});

export { getUser, changeUser };
