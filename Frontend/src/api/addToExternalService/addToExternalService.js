// @flow

import qs from 'qs';
import crmRequest from 'crm-helpers/api/crmRequest';

const URL_GET_USERS = '/employee/get_employees';
const URL_GET_COUNTRIES = '/country';
const URL_GET_SOURCES = '/source';
const URL_ADD_SALE = '/export/export_to_1c_and_save';
const ROLES = {
    RM: 3,
    MANAGERS: 6,
};


const DEFAULT_SORT = 'firstName,asc';
const ANOTHER_DEFAULT_SORT = 'name,asc';
const COUNTRY_SORT = 'nameEn,asc';

export const getUsers = (
): Promise<Object> => crmRequest({
    url: URL_GET_USERS,
    method: 'GET',
    params: {
        size: 1000,
        sort: DEFAULT_SORT,
        role: [ROLES.RM, ROLES.MANAGERS],
        isActive: true,
    },
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
});

export const getCountries = (): Promise<Object> => crmRequest({
    url: URL_GET_COUNTRIES,
    method: 'GET',
    params: {
        size: 1000,
        sort: COUNTRY_SORT,
    },
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
});

export const getSources = (): Promise<Object> => crmRequest({
    url: URL_GET_SOURCES,
    method: 'GET',
    params: {
        size: 1000,
        sort: ANOTHER_DEFAULT_SORT,
    },
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
});

export const exportSale = (data: Object): Promise<boolean> => crmRequest({
    url: URL_ADD_SALE,
    method: 'POST',
    data,
});


