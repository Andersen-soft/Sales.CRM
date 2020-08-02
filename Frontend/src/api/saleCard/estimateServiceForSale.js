// @flow

import crmRequest from 'crm-helpers/api/crmRequest';

const URL_GET_ESTIMATIONS: string = '/estimation_requests/get_not_tied_to_sales_requests';
const URL_UPDATE_ESTIMATION: string = '/estimation_requests/';

export const getEstimations = (companyId: ?number) => (
    crmRequest({
        url: URL_GET_ESTIMATIONS,
        method: 'GET',
        params: {
            company: companyId,
            size: 1000,
            isActive: true,
        },
    })
);

export const updateEstimation = (id: number, data?: number) => (
    crmRequest({
        url: `${URL_UPDATE_ESTIMATION}${id}`,
        method: 'PUT',
        data: { companySaleId: data },
    })
);
