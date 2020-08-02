// @flow

import {
    GET_ESTIMATIONS_REQUEST,
    GET_ESTIMATIONS_REQUEST_SUCCESS,
    GET_ESTIMATIONS_REQUEST_ERROR,
} from 'crm-constants/estimationRequestPage/estimationTable';
import type { Action } from '../Store.flow';
import type { EstimationType } from 'crm-components/estimationRequestPage/EstimationTable/EstimationTable';

export type EstimationTableState = {
    estimations: Array<EstimationType>,
    loading: boolean,
    error: string | null,
}

const initialState: EstimationTableState = {
    estimations: [],
    loading: false,
    error: null,
};

const estimationsReducer = (state: EstimationTableState = initialState, { type, payload }: Action) => {
    switch (type) {
        case GET_ESTIMATIONS_REQUEST: {
            return {
                ...state,
                loading: true,
                error: null,
                estimations: [],
            };
        }
        case GET_ESTIMATIONS_REQUEST_SUCCESS: {
            return {
                ...state,
                loading: false,
                error: null,
                estimations: payload,
            };
        }
        case GET_ESTIMATIONS_REQUEST_ERROR: {
            return {
                ...state,
                loading: false,
                error: payload,
            };
        }
        default:
            return state;
    }
};

export default estimationsReducer;
