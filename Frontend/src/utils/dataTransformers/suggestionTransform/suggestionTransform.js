// @flow

import { getCompany, getEmployee } from 'crm-api/allResumeRequestsService/allResumeRequestsService';
import { fetchEstimationColumnData } from 'crm-api/allEstimationRequestsService/allEstimationRequestsService';
import { COLUMN_KEYS } from 'crm-constants/allEstimationRequests/estimationRequestsConstants';
import {
    HEAD_SALE_ID,
    RM_ID,
    SALE_ID,
    MANAGER_ID,
} from 'crm-roles';

export const getCompanySuggestionList = async (props: Object) => {
    const response = await getCompany(props);

    return response.map(({ id, name }) => ({ label: name, value: id }));
};

export const getRsponsibleRmSuggestionList = async (props: Object) => {
    const { content } = await getEmployee({ ...props, role: [RM_ID, MANAGER_ID], name: null });

    return content.map(({ firstName, lastName, id }) => ({ label: `${firstName} ${lastName}`, value: id }));
};

export const getResponsibleForSaleSuggestionList = async (props: Object) => {
    const { content } = await getEmployee({ ...props, role: [SALE_ID, HEAD_SALE_ID, MANAGER_ID, RM_ID], name: null });

    return content.map(({ firstName, lastName, id }) => ({ label: `${firstName} ${lastName}`, value: id }));
};

export const getDataForFilter = (columnKey: string) => async (props: Object) => {
    const { content } = await fetchEstimationColumnData(columnKey, props);

    return COLUMN_KEYS.COMPANY === columnKey
        ? content.map(({ id, name }) => ({ label: name, value: id }))
        : content.map(({ firstName, lastName, id }) => ({ label: `${firstName} ${lastName}`, value: id }));
};
