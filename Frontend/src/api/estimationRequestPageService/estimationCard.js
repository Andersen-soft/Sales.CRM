// @flow

import crmRequest from 'crm-helpers/api/crmRequest';
import {
    URL_GET_REQUEST,
    URL_GET_ESTIMATION_STATUS,
    URL_GET_EMPLOYEES,
    URL_GET_COMPANY_SEARCH,
} from 'crm-constants/estimationRequestPage/estimationCard';
import qs from 'qs';
import trimValue from 'crm-utils/trimValue';

export const getEstimationRequest = (estimationId: number) => crmRequest({
    url: `${URL_GET_REQUEST}/${estimationId}`,
    method: 'GET',
});

export const updateEstimation = (estimationId: number, fieldName: string, updateData: string | number) => crmRequest({
    url: `${URL_GET_REQUEST}/${estimationId}`,
    method: 'PUT',
    data: { [fieldName]: updateData },
});

export const getEstimationStatus = () => crmRequest({
    url: URL_GET_ESTIMATION_STATUS,
    method: 'GET',
});

export const getEmployees = (roles: Array<number>) => crmRequest({
    url: URL_GET_EMPLOYEES,
    method: 'GET',
    params: {
        isActive: true,
        role: roles,
        size: 5000,
    },
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
});

export const getCompaniesSearch = (value: string | void, size: number, canceled?: boolean = false) => {
    const name = trimValue(value);

    return crmRequest({
        url: URL_GET_COMPANY_SEARCH,
        method: 'GET',
        params: {
            name,
            size,
            sort: 'name,asc',
        },
    }, canceled);
};

export const deleteEstimation = (estimationId: number) => crmRequest({
    url: `${URL_GET_REQUEST}/${estimationId}`,
    method: 'DELETE',
});
