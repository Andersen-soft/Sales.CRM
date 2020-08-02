// @flow

import crmRequest from 'crm-helpers/api/crmRequest';

import qs from 'qs';

const URL_GET_EMPLOYEES: string = '/employee/get_employees';

type RequestParams = {
    role?: Array<number>,
    responsibleRM?: boolean,
}

export default (requestParams: RequestParams) => crmRequest({
    url: URL_GET_EMPLOYEES,
    method: 'GET',
    params: {
        ...requestParams,
        isActive: true,
        size: 5000,
        sort: 'firstName,asc',
    },
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
});
