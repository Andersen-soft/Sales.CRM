// @flow

import crmRequest from 'crm-helpers/api/crmRequest';
import { PAGINATION_STEP_COUNT } from 'crm-constants/pagination';
import { ASCENDING, DESCENDING } from 'crm-constants/sort';

import type { Ascending, Descending } from 'crm-constants/sort';

const URL_PUT: string = 'resume_request/update_request';
const URL_GET: string = 'resume_request/get_requests?sort=isFavorite,desc';
const URL_GET_EMPLOYEES: string = 'employee/get_employees';
const URL_GET_INITIAL: string = 'resume_request/get_requests?sort=isFavorite,desc&sort=deadline,asc';

let countPages: number = 1;
let sortConfig: string = '';
let sortOrder: Ascending | Descending = DESCENDING;

type FiltersConfig = {
    'isActive': string | boolean,
    'status': string,
    'responsibleRm.id': string | number,
    'technologies': string,
    'companySale.company.name': string,
    'id': string | number,
}

let filtersConfig: FiltersConfig = {
    'isActive': '',
    'status': '',
    'responsibleRm.id': '',
    'technologies': '',
    'companySale.company.name': '',
    'id': '',
};

export const getResponsiblesForRequest = () => (
    crmRequest({
        url: URL_GET_EMPLOYEES,
        method: 'GET',
        params: {
            sort: 'lastName,asc',
            size: 1000,
            'role.name': 'rm',
        },
    })
);

export const getEmployees = () => {
    countPages = 1;
    return crmRequest({ url: URL_GET_INITIAL, method: 'GET' });
};

export const sortEmployees = (index: string) => {
    if (sortOrder === DESCENDING) {
        sortOrder = ASCENDING;
    } else {
        sortOrder = DESCENDING;
    }
    sortConfig = `${index}${sortOrder}`;
    countPages = 1;

    return crmRequest({
        url: URL_GET,
        params: {
            sort: sortConfig,
            ...filtersConfig,
        },
        method: 'GET',
    });
};

export const toggleFavorite = (index: number, itemFavorite: boolean) => {
    countPages = 1;
    return crmRequest({
        url: URL_PUT,
        method: 'PUT',
        params: { id: index },
        data: { isFavorite: itemFavorite },
        headers: { 'content-type': 'application/json' },
    });
};

export const paginationResumeRequest = () =>
    crmRequest({
        url: URL_GET,
        method: 'GET',
        params: {
            sort: sortConfig,
            page: countPages,
            size: PAGINATION_STEP_COUNT,
            ...filtersConfig,
        },
    })
        .then(response => {
            if (response.length) {
                countPages++;
            }
            return response;
        });

export const getFilters = (values: Object) => {
    const {
        isActive,
        requestStatus,
        responsibleRMid,
        technologies,
        company,
        id,
    } = values;

    filtersConfig = {
        'isActive': isActive,
        'status': requestStatus,
        'responsibleRm.id': responsibleRMid,
        'technologies': technologies,
        'companySale.company.name': company,
        'id': id,
    };

    countPages = 1;

    return crmRequest({
        url: URL_GET,
        params: {
            sort: sortConfig,
            ...filtersConfig,
        },
        method: 'GET',
    });
};
