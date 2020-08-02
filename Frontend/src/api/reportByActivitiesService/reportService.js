// @flow

import crmRequest from 'crm-helpers/api/crmRequest';

const URL_GET_REPORTS: string = '/activity/reports';
const URL_DOWNLOAD_REPORT: string = '/activity/reports/download';

export type fetchReportArguments = {
    from: string,
    to: string,
}

export const getReports = async ({
    from,
    to,
}: fetchReportArguments) => crmRequest({
    url: URL_GET_REPORTS,
    method: 'GET',
    params: {
        from,
        to,
    },
});

export const downloadReport = (creationFrom: ?string, creationTo: ?string) => crmRequest({
    url: URL_DOWNLOAD_REPORT,
    params: {
        creationFrom,
        creationTo,
    },
    responseType: 'blob',
});
