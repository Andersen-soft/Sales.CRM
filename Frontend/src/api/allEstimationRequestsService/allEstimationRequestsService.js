// @flow

import qs from 'qs';
import crmRequest from 'crm-helpers/api/crmRequest';
import { PAGE_SIZE, COLUMN_KEYS } from 'crm-constants/allEstimationRequests/estimationRequestsConstants';
import {
    HEAD_SALE_ID,
    RM_ID,
    SALE_ID,
    MANAGER_ID,
} from 'crm-roles';
import getObjectWithoutEmptyProperties from 'crm-utils/dataTransformers/getObjectWithoutEmptyProperties';
import type { fetchAllEstimationRequestsArguments, Filters } from 'crm-types/estimationRequests';

export type fetchEstimationRequestsArguments = {
    page?: ?number,
    size?: number,
    isActive?: boolean,
    sort?: string,
    status?: Array<string> | null,
    company?: number | null,
    responsibleForSaleRequest?: number | null,
    responsibleForRequest?: number | null,
    name?: string | null,
};

const URL_DOWNLOAD_REPORT = '/estimation_requests/reports/download';
const URL_GET_COMPANIES_FOR_FILTERS = '/company/get_companies';
const URL_GET_EMPLOYEES_FOR_FILTERS = '/employee/get_employees';
const URL_GET_ESTIMATION = '/estimation_requests';
const URL_GET_ESTIMATION_STATUSES = '/estimation_requests/statuses';

const DEFAULT_SORT = `${COLUMN_KEYS.DEADLINE},desc`;

const getEstimationRequests = ({
    status,
    company,
    responsibleForSaleRequest,
    responsibleForRequest,
    name,
    page,
    size = PAGE_SIZE,
    isActive = true,
    sort,
}: fetchAllEstimationRequestsArguments) => crmRequest({
    url: URL_GET_ESTIMATION,
    method: 'GET',
    params: getObjectWithoutEmptyProperties({
        status,
        company,
        responsibleForSaleRequest,
        responsibleForRequest,
        name,
        page,
        size,
        isActive,
        sort: sort || DEFAULT_SORT,
    }),
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
});

const getEstimationStatuses = () => crmRequest({
    url: URL_GET_ESTIMATION_STATUSES,
    method: 'GET',
});

const getUrl = (columnKey: string) => {
    switch (columnKey) {
        case COLUMN_KEYS.COMPANY:
            return URL_GET_COMPANIES_FOR_FILTERS;
        case COLUMN_KEYS.RESPONSIBLE:
        case COLUMN_KEYS.RESPONSIBLE_FOR_SALE:
            return URL_GET_EMPLOYEES_FOR_FILTERS;
        default:
            return false;
    }
};

const getRequestParam = (columnKey: string) => {
    switch (columnKey) {
        case COLUMN_KEYS.RESPONSIBLE:
            return { 'estimationRequest.isCreators': false, isActive: true };
        case COLUMN_KEYS.RESPONSIBLE_FOR_SALE:
            return { role: [SALE_ID, HEAD_SALE_ID, MANAGER_ID, RM_ID], isActive: true };
        default:
            return {};
    }
};

const fetchEstimationColumnData = (
    columnKey: string,
    {
        company,
        name,
        responsibleForRequest,
        responsibleForSaleRequest,
        status,
    }: fetchEstimationRequestsArguments
) => crmRequest({
    url: getUrl(columnKey),
    method: 'GET',
    params: {
        size: 1000000,
        ...getRequestParam(columnKey),
        ...getObjectWithoutEmptyProperties({
            'estimationRequest.isEstimationRequestFilter': true,
            'estimationRequest.companyId': company,
            'estimationRequest.name': name,
            'estimationRequest.responsibleId': responsibleForRequest,
            'estimationRequest.responsibleForSaleRequest': responsibleForSaleRequest,
            'estimationRequest.status': status,
        }),
    },
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
});

const downloadReport = (filters: Filters, sort: string) => crmRequest({
    url: URL_DOWNLOAD_REPORT,
    method: 'GET',
    params: {
        isActive: true,
        ...getObjectWithoutEmptyProperties(filters),
        sort: sort || DEFAULT_SORT,
    },
    responseType: 'blob',
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
});

export {
    getEstimationRequests,
    downloadReport,
    getEstimationStatuses,
    fetchEstimationColumnData,
};
