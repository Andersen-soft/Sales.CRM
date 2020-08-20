// @flow

import crmRequest from 'crm-helpers/api/crmRequest';
import { URL_ADD_RESUME_REQUEST } from 'crm-constants/resumeRequestPage/resumeRequestPageConstant';

const URL_PRIORITY: string = 'resume_request/get_priorities';
const URL_GET_COMPANIES: string = 'company/get_companies';
const URL_GET_SALES: string = 'company_sale/get_sales';
const URL_SUBMIT_FORM: string = 'resume_request/create_request';
const URL_GET_RESUME_REQUEST: string = '/resume_request';

type resumeRequest = {
    company?: number,
}

export const getPriorities = () => (
    crmRequest({ url: URL_PRIORITY, method: 'GET' })
);

export const getCompanies = (name: string) => (
    crmRequest({
        url: URL_GET_COMPANIES,
        method: 'GET',
        params: { name },
    })
);

export const getSales = (id: number) => (
    crmRequest({
        url: URL_GET_SALES,
        method: 'GET',
        params: { id, isActive: true },
    })
);

export const addResume = (values: Object) => {
    const {
        technologies,
        priority,
        companySaleId,
        deadline,
        startAt,
        comment,
        selectedFiles,
    } = values;

    const formData = new FormData();

    formData.append('json', new Blob([JSON.stringify({
        technologies,
        priority,
        companySaleId,
        deadline,
        startAt,
        comment,
    })], {
        type: 'application/json',
    }));

    formData.append('files', selectedFiles);

    return crmRequest({
        url: URL_SUBMIT_FORM,
        method: 'POST',
        headers: { 'content-type': 'multipart/form-data; boundary=" "' },
        data: formData,
    });
};

export const addResumeRequest = (values: Object) => {
    const {
        companyId,
        name,
        deadline,
        priority,
        comment,
        selectedFiles,
        companySale,
    } = values;

    const formData = new FormData();

    formData.append('json', new Blob([JSON.stringify({
        companyId,
        name,
        deadline,
        priority,
        comment,
        companySale,
    })], {
        type: 'application/json',
    }));

    selectedFiles.forEach(file => {
        formData.append('files', file, file.name);
    });

    return crmRequest({
        url: URL_ADD_RESUME_REQUEST,
        methos: 'POST',
        headers: { 'content-type': 'multipart/form-data; boundary=" "' },
        data: formData,
    });
};

export const getResumeRequest = (args: resumeRequest) => crmRequest({
    url: URL_GET_RESUME_REQUEST,
    method: 'GET',
    params: {
        ...args,
        isActive: true,
    },
});
