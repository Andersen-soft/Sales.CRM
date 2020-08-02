// @flow

import crmRequest from 'crm-helpers/api/crmRequest';

const CREATE_REQUEST_URL: string = '/estimation_request/create_old';
const UPDATE_REQUEST_URL: string = '/estimation_request/update_old';

type EstimationRequest = {
    companyId: number,
    name: string,
    oldId?: string,
    id?: number,
};

export const createEstimation = ({ companyId, name, oldId }: EstimationRequest) => (
    crmRequest({
        url: CREATE_REQUEST_URL,
        method: 'POST',
        data: { oldId, name, companyId },
    })
);

export const updateEstimation = ({
    id, name, companyId, oldId,
}: EstimationRequest) => (
    crmRequest({
        url: UPDATE_REQUEST_URL,
        method: 'PUT',
        data: {
            id, name, companyId, oldId,
        },
    })
);
