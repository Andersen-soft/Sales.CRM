// @flow

import crmRequest from 'crm-helpers/api/crmRequest';

const URL_EXPORT_COMPANIES = '/company/download';
const URL_EXPORT_CONTACTS = '/contact/download';
const URL_EXPORT_CV_STATISTICS = '/all_resume_request/reports/resume_processing';

export const exportCompanies = (data: Object): Promise<boolean> => crmRequest({
    url: URL_EXPORT_COMPANIES,
    method: 'POST',
    params: data,
});

export const exportContacts = (data: Object): Promise<boolean> => crmRequest({
    url: URL_EXPORT_CONTACTS,
    method: 'POST',
    params: data,
});


export const exportCVStatistics = (data: Object): Promise<boolean> => crmRequest({
    url: URL_EXPORT_CV_STATISTICS,
    method: 'GET',
    params: data,
});
