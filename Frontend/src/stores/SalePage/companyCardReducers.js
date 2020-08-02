// @flow

import {
    GET_COMPANY_CARD_REQUEST,
    GET_COMPANY_CARD_SUCCESS_REQUEST,
    GET_COMPANY_CARD_ERROR,
    UPDATE_COMPANY_CARD,
    EDIT_COMMENT,
    GET_SEARCH_COMPANY_LIST,
    CLEAR_COMPANY_CARD,
} from 'crm-constants/salePage/companyCardConstant';
import type { Company } from 'crm-types/resourceDataTypes';
import type { Action } from '../Store.flow';

const initialState = {
    companyCard: { linkedSales: [] },
    searchCompanyList: [],
    isLoading: false,
    error: null,
};

export type CompanyCardState = {
    companyCard: Company,
    searchCompanyList: Company[],
    isLoading: boolean,
}

const companyCard = (state: CompanyCardState = initialState, action: Action) => {
    switch (action.type) {
        case GET_COMPANY_CARD_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case GET_COMPANY_CARD_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case GET_COMPANY_CARD_SUCCESS_REQUEST:
            return {
                ...state,
                isLoading: false,
                companyCard: action.payload,
            };
        case GET_SEARCH_COMPANY_LIST:
            return {
                ...state,
                searchCompanyList: action.payload,
            };
        case UPDATE_COMPANY_CARD:
            return {
                ...state,
                isLoading: false,
            };
        case EDIT_COMMENT:
            return {
                ...state,
                companyCard: {
                    ...state.companyCard,
                    description: action.payload,
                },
            };
        case CLEAR_COMPANY_CARD:
            return initialState;
        default:
            return state;
    }
};

export default companyCard;
