// @flow

import {
    GET_FIRST_HISTORY_REQUEST,
    GET_HISTORY_ERROR,
    GET_HISTORY_REQUEST,
    GET_HISTORY_SUCCESS,
} from 'crm-constants/estimationRequestPage/historyConstants';
import { fetchHistory as fetchHistoryAPI } from 'crm-api/estimationRequestPageService/historyService';
import type { Dispatch } from 'redux';

export const fetchHistory = (id: number, size?: number, page?: number) => async (dispatch: Dispatch) => {
    dispatch({
        type: page ? GET_HISTORY_REQUEST : GET_FIRST_HISTORY_REQUEST,
    });

    try {
        const { content, totalElements } = await fetchHistoryAPI(id, size, page);

        dispatch({
            type: GET_HISTORY_SUCCESS,
            payload: { content, totalElements },
        });
    } catch (error) {
        dispatch({
            type: GET_HISTORY_ERROR,
            payload: error,
        });
    }
};
