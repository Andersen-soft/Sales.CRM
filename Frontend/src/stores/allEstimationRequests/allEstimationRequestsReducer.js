// @flow

import type { Action } from 'redux';

import {
    SET_PAGE,
    SET_ESTIMATION_REQUEST_FILTERS,
    SET_ESTIMATION_REQUEST_SORT,
    CLEAR_ESTIMATION_REQUESTS,
} from 'crm-constants/allEstimationRequests/estimationRequestsConstants';
import type { EstimationRequestState } from 'crm-types/estimationRequests';

const initialState = {
    page: 0,
    filters: {
        status: null,
        company: null,
        responsibleForSaleRequest: null,
        responsibleForRequest: null,
        name: null,
    },
    sort: '',
};

export const allEstimationRequestsReducer = (
    state: EstimationRequestState = initialState,
    { payload, type }: Action,
) => {
    switch (type) {
        case SET_PAGE: {
            return {
                ...state,
                page: payload,
            };
        }
        case CLEAR_ESTIMATION_REQUESTS: {
            return initialState;
        }
        case SET_ESTIMATION_REQUEST_FILTERS: {
            return {
                ...state,
                filters: payload,
            };
        }
        case SET_ESTIMATION_REQUEST_SORT: {
            return {
                ...state,
                sort: payload,
            };
        }
        default:
            return state;
    }
};

export default allEstimationRequestsReducer;
