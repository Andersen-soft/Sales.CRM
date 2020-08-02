// @flow

import {
    GET_RESUME_REQUEST,
    GET_REQUEST,
    UPDATE_OR_DELETE_REQUEST,
    REQUEST_ERROR,
} from 'crm-constants/resumeRequestPage/resumeRequestCardConstants';

import type { Action } from '../Store.flow';

const initialState = {
    request: {},
    isLoading: false,
    error: null,
    historyPage: 0,
};

type ResumeRequest = {
    company?: {
        id: number,
        name: string,
    },
    created?: string,
    deadLine?: string,
    employee?: {
        firstName: string,
        id: number,
        lastName: string,
    },
    id?: number,
    name?: string,
    priority?: string,
    responsible?: {
        firstName: string,
        id: number,
        lastName: string,
    },
    saleId?: number | null,
    status?: string,
    autoDistribution?: false,
}

export type RequestState = {
    request: ResumeRequest,
    isLoading: boolean,
    error: null,
    historyPage: number,
}

const ResumeRequestCardReducer = (state: RequestState = initialState, action: Action) => {
    const {
        type,
        payload,
    } = action;

    switch (type) {
        case GET_RESUME_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case GET_REQUEST:
            return {
                ...state,
                isLoading: false,
                request: payload,
            };
        case UPDATE_OR_DELETE_REQUEST:
            return {
                ...state,
                isLoading: false,
            };
        case REQUEST_ERROR:
            return {
                ...state,
                isLoading: false,
                error: payload,
            };

        default:
            return state;
    }
};

export default ResumeRequestCardReducer;
