// @flow

import qs from 'qs';
import crmRequest from 'crm-helpers/api/crmRequest';
import {
    PAGE_SIZE,
    TABLE_COLUMN_KEYS,
} from 'crm-constants/allResumeRequests/resumeRequestsConstants';
import getObjectWithoutEmptyProperties from 'crm-utils/dataTransformers/getObjectWithoutEmptyProperties';

export type fetchResumeRequestsArguments = {
    page?: ?number,
    size?: number,
    isActive?: boolean,
    sort?: string,
    status?: Array<string> | null,
    companyId?: number | null,
    responsibleForSaleRequestId?: number | null,
    responsibleId?: number | null,
    name?: string | null,
    'resumes.responsibleHr.id'?: Array<number> | null,
    'resumes.status'?: Array<string> | null,
    role?: Array<string>,
};

const URL_GET_RESUME_STATUSES = '/resume_request/get_statuses';
const URL_GET_RESUME_BY = '/all_resume_request';
const URL_GET_COMPANIES_FOR_FILTERS = '/company/get_by_resume_request';
const URL_GET_EMPLOYEES = '/employee/get_employees';
const URL_DOWNLOAD_REPORT = '/all_resume_request/reports/download';

const DEFAULT_SORT = `${TABLE_COLUMN_KEYS.CREATION_DATE},desc`;

const getResumeRequests = ({
    status,
    companyId,
    responsibleForSaleRequestId,
    responsibleId,
    name,
    page,
    size = PAGE_SIZE,
    isActive = true,
    sort,
    'resumes.responsibleHr.id': responsibleHr,
    'resumes.status': resumesStatus,
}: fetchResumeRequestsArguments) => crmRequest({
    url: URL_GET_RESUME_BY,
    method: 'GET',
    params: getObjectWithoutEmptyProperties({
        status,
        companyId,
        size,
        responsibleForSaleRequestId,
        responsibleId,
        name,
        isActive,
        page,
        'sort': sort || DEFAULT_SORT,
        'resumes.responsibleHr.id': responsibleHr,
        'resumes.status': resumesStatus,
    }),
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
});

const getResumeStatuses = () => crmRequest({
    url: URL_GET_RESUME_STATUSES,
    method: 'GET',
});

const getCompany = (filters: fetchResumeRequestsArguments) => crmRequest({
    url: URL_GET_COMPANIES_FOR_FILTERS,
    method: 'get',
    params: {
        size: 1000000,
        isActive: true,
        ...getObjectWithoutEmptyProperties(filters),
    },
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
});

const getEmployee = (filters: fetchResumeRequestsArguments) => crmRequest({
    url: URL_GET_EMPLOYEES,
    method: 'get',
    params: {
        size: 1000000,
        isActive: true,
        ...getObjectWithoutEmptyProperties(filters),
    },
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
});

const downloadReport = (filters: fetchResumeRequestsArguments, sort: string) => crmRequest({
    url: URL_DOWNLOAD_REPORT,
    responseType: 'blob',
    params: {
        isActive: true,
        ...getObjectWithoutEmptyProperties(filters),
        sort: sort || DEFAULT_SORT,
    },
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
});

export {
    getCompany,
    getEmployee,
    getResumeRequests,
    getResumeStatuses,
    downloadReport,
};
