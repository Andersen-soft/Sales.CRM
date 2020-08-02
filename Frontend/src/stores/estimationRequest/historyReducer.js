// @flow

import { type HistoryType } from 'crm-types/estimationRequests';
import {
    GET_HISTORY_REQUEST,
    GET_HISTORY_SUCCESS,
    GET_HISTORY_ERROR,
    GET_FIRST_HISTORY_REQUEST,
} from 'crm-constants/estimationRequestPage/historyConstants';
import type { Action } from '../Store.flow';

export type HistoryState = {
    eventHistory: Array<HistoryType>,
    loading: boolean,
    error: string | null,
    totalElements: number,
    resetPage: boolean,
}

const initialState:HistoryState = {
    eventHistory: [],
    loading: false,
    error: null,
    totalElements: 0,
    resetPage: false,
};

const historyReducer = (state: HistoryState = initialState, { type, payload }: Action) => {
    switch (type) {
        case GET_HISTORY_REQUEST: {
            return {
                ...state,
                loading: true,
                error: null,
                eventHistory: [],
            };
        }

        case GET_FIRST_HISTORY_REQUEST: {
            return {
                ...state,
                loading: true,
                error: null,
                eventHistory: [],
                resetPage: true,
            };
        }

        case GET_HISTORY_SUCCESS: {
            return {
                ...state,
                loading: false,
                resetPage: false,
                error: null,
                eventHistory: [...payload.content],
                totalElements: payload.totalElements,
            };
        }

        case GET_HISTORY_ERROR: {
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

export default historyReducer;
