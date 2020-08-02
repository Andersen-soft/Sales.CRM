// @flow

import crmRequest from 'crm-helpers/api/crmRequest';

import qs from 'qs';

const URL_GET_REQUEST: string = '/resume_request';
const URL_GET_COMPANY_SEARCH: string = 'company/get_companies';
const URL_GET_RESUME_STATUS: string = '/resume_request/get_statuses';
const URL_GET_EMPLOYEES: string = '/employee/get_employees';
const URL_GET_EMPLOYEE: string = '/employee/get_employee';

export const getResumeRequest = (resumeId: number | string) => crmRequest({
    url: `${URL_GET_REQUEST}/${resumeId}`,
    method: 'GET',
});

export const deleteResumeRequest = (resumeId: number) => crmRequest({
    url: `${URL_GET_REQUEST}/${resumeId}`,
    method: 'DELETE',
});

export const updateResumeRequest = (resumeId: number, fieldName: string, updateData: string | number) => crmRequest({
    url: `${URL_GET_REQUEST}/${resumeId}`,
    method: 'PUT',
    data: {
        [fieldName]: updateData,
    },
});

export const getResumeStatus = () => crmRequest({
    url: URL_GET_RESUME_STATUS,
    method: 'GET',
});

export const getCompaniesSearch = () => crmRequest({
    url: URL_GET_COMPANY_SEARCH,
    method: 'GET',
    params: {
        size: 5000,
        sort: 'name,asc',
    },
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

export const getEmploee = (id: number) => crmRequest({
    url: URL_GET_EMPLOYEE,
    method: 'GET',
    params: {
        id,
    },
});
