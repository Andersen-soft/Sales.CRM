// @flow

import qs from 'qs';
import crmRequest from 'crm-helpers/api/crmRequest';
import getObjectWithoutEmptyProperties
    from 'crm-utils/dataTransformers/getObjectWithoutEmptyProperties';

const URL_GET_USERS = '/employee/get_employees';
const URL_GET_ROLES = '/employee/get_all_roles';
const URL_GET_CORPORATE_USERS = '/admin/ldap_users';
const URL_REGISTER_USER = '/admin/register';
const URL_UPDATE_USER = '/employee/update_employee';
const URL_SEND_LINK_TO_CHANGE_PASSWORD = '/admin/reset_password';

const DEFAULT_SORT = 'id,desc';

type FiltersParams = {
    size: number,
    sortType: string,
    allFilters: Object,
    isActive?: ?boolean,
}

const getUsers = (
    page: number,
    size: number,
    sort: string,
    allFilters: Object,
): Promise<boolean> => crmRequest({
    url: URL_GET_USERS,
    method: 'GET',
    params: {
        size,
        page,
        sort: sort || DEFAULT_SORT,
        ...allFilters,
    },
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
});

export const getUsersWithFilters = ({ size, sortType, allFilters, isActive = null }: FiltersParams): Promise<Object> => crmRequest({
    url: URL_GET_USERS,
    method: 'GET',
    params: getObjectWithoutEmptyProperties({
        size,
        sort: sortType || DEFAULT_SORT,
        isActive,
        ...allFilters,
    }),
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
});

export const requestDataForFiltersActions = (
): Promise<Array<Object>> => crmRequest({
    url: URL_GET_ROLES,
    method: 'GET',
});


export const getCorpotateUsers = (email?: string): Promise<Object> => crmRequest({
    url: URL_GET_CORPORATE_USERS,
    method: 'GET',
    params: {
        isRegistered: false,
        email,
    },
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
});

export const registerUser = (data: Object) => crmRequest({
    url: URL_REGISTER_USER,
    method: 'POST',
    data,
});

export const updateUser = (userId: number, data: Object) => crmRequest({
    url: URL_UPDATE_USER,
    method: 'PUT',
    params: { id: userId },
    data,
});

export const sendLinkToChangePassword = (id: number | null) => crmRequest({
    url: URL_SEND_LINK_TO_CHANGE_PASSWORD,
    method: 'GET',
    params: { id },
});

export { getUsers };
