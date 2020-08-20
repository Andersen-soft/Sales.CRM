// @flow

import crmRequest from 'crm-helpers/api/crmRequest';
import { HISTORY_ROW_PER_PAGE, URL_GET_ESTIMATION_HISTORY } from 'crm-constants/estimationRequestPage/historyConstants';

export const fetchHistory = (id: number, size?: number, page?: number) => crmRequest({
    url: URL_GET_ESTIMATION_HISTORY,
    method: 'GET',
    params: {
        id,
        size: size || HISTORY_ROW_PER_PAGE,
        page,
        sort: 'createDate,desc',
    },
});
