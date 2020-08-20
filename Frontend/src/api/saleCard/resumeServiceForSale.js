// @flow


import crmRequest from 'crm-helpers/api/crmRequest';

const URL_UPDATE_RESUME_REQUEST: string = '/resume_request';
const URL_GET_REQUESTS: string = '/resume_request';

export const apiUpdateResume = (id: number, value: number) => (
    crmRequest({
        url: `${URL_UPDATE_RESUME_REQUEST}/${id}`,
        method: 'PUT',
        data: { companySaleId: value },
    })
);

export const apiGetResumes = (companyId: ?number) => (
    crmRequest({
        url: URL_GET_REQUESTS,
        method: 'GET',
        params: {
            'company.id': companyId,
            'companySale': 0,
            'isActive': true,
        },
    })
);
