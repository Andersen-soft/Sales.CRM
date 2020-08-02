// @flow

import {
    SALES_REQUEST,
    SALES_ERROR,
    GET_SALES_SUCCESS,
    GET_SALES_COUNT_BY_STATUSES_SUCCESS,
    UPDATE_SALE_SUCCESS,
    SET_PAGE,
} from 'crm-constants/desktop/salesConstants';
import type { Sale, Contact } from 'crm-types/resourceDataTypes';

import type { Action } from '../Store.flow';

const initialState = {
    sales: {
        content: [],
        totalElements: 0,
    },
    isLoading: false,
    error: null,
    salesCount: {},
    contacts: [],
};

export type SalesState = {
    sales: {
        content: Array<Sale>,
        totalElements: number,
    },
    salesCount: { [string]: number },
    contacts: Array<Contact>,
    isLoading: boolean,
}

const salesReducer = (state: SalesState = initialState, { payload, type }: Action) => {
    switch (type) {
        case SALES_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case GET_SALES_SUCCESS:
            return {
                ...state,
                isLoading: false,
                sales: payload,
                error: null,
            };
        case SALES_ERROR:
            return {
                ...state,
                isLoading: false,
                error: payload,
            };
        case UPDATE_SALE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                error: null,
            };
        case GET_SALES_COUNT_BY_STATUSES_SUCCESS:
            return {
                ...state,
                salesCount: payload,
                error: null,
            };
        case SET_PAGE:
            return {
                ...state,
                pagination: payload,
            };
        default:
            return state;
    }
};

export default salesReducer;
