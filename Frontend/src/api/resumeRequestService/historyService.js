// @flow

import crmRequest from 'crm-helpers/api/crmRequest';

import { HISTORY_ROW_PER_PAGE } from 'crm-constants/resumeRequestPage/historyConstants';

const URL_GET_RESUME_HISTORY = (id: number) => `/resume_request/${id}/history`;

export const fetchHistory = (id: number, page?: number) => (crmRequest({
    url: URL_GET_RESUME_HISTORY(id),
    method: 'GET',
    params: {
        size: HISTORY_ROW_PER_PAGE,
        page,
        sort: 'createDate,desc',
    },
}));
