// @flow

import {
    GET_SALE_CARD_REQUEST,
    GET_SALE_CARD_SUCCESS_REQUEST,
    GET_SALE_CARD_ERROR,
    EDIT_SALE_COMMENT,
    GET_RESUMES_LIST_SUCCESS_REQUEST,
    GET_ESTIMATES_LIST_SUCCESS_REQUEST,
    CLEAR_SALE_CARD,
} from 'crm-constants/salePage/saleCardConstant';
import type { Action } from '../Store.flow';
import type { Sale } from 'crm-types/sales';

const initialState = {
    sale: {
        id: 0,
        company: { id: 0, name: '' },
        createDate: '',
        description: '',
        estimations: [],
        name: '',
        lastActivity: { dateActivity: '' },
        mainContact: {},
        mainContactId: 0,
        nextActivityDate: '',
        responsible: {
            additionalInfo: '',
            additionalPhone: '',
            email: '',
            firstName: '',
            id: 0,
            lastName: '',
            phone: '',
            skype: '',
        },
        resumes: [],
        status: '',
        nextActivityId: 0,
        exported: true,
        distributedEmployeeId: null,
        inDayAutoDistribution: false,
        source: null,
        recommendation: null,
        category: null,
    },
    resumesRequestsList: [],
    estimationsList: [],
    isLoading: false,
    error: null,
};

type RequestsItem = {
    id?: number,
    name?: string,
}

export type SaleCardState = {
    sale: Sale,
    resumesRequestsList: Array<RequestsItem>,
    estimationsList: Array<RequestsItem>,
    isLoading: boolean,
}

const ACTION_HANDLERS = {
    [GET_SALE_CARD_REQUEST]: state => ({
        ...state,
        isLoading: true,
        error: null,
    }),
    [GET_SALE_CARD_SUCCESS_REQUEST]: (state, payload) => ({
        ...state,
        sale: payload,
        isLoading: false,
        error: null,
    }),
    [GET_SALE_CARD_ERROR]: (state, payload) => ({
        ...state,
        isLoading: false,
        error: payload,
    }),
    [EDIT_SALE_COMMENT]: (state, payload) => ({
        ...state,
        isLoading: false,
        sale: {
            ...state.sale,
            description: payload,
        },
    }),
    [GET_RESUMES_LIST_SUCCESS_REQUEST]: (state, payload) => ({
        ...state,
        isLoading: false,
        resumesRequestsList: payload,
    }),
    [GET_ESTIMATES_LIST_SUCCESS_REQUEST]: (state, payload) => ({
        ...state,
        isLoading: false,
        estimationsList: payload,
    }),
    [CLEAR_SALE_CARD]: () => initialState,
};

export function saleCard(state: SaleCardState = initialState, { payload, type }: Action) {
    const handler = ACTION_HANDLERS[type];

    return handler ? handler(state, payload) : state;
}

export default saleCard;
