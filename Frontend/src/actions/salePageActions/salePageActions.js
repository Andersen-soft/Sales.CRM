// @flow

import type { Dispatch } from 'redux';
import { pathOr } from 'ramda';
import {
    CLEAR_SALE_CARD,
    GET_SALE_CARD_ERROR,
    GET_SALE_CARD_REQUEST,
    GET_SALE_CARD_SUCCESS_REQUEST,
} from 'crm-constants/salePage/saleCardConstant';
import { CLEAR_CONTACTS_CARD } from 'crm-constants/salePage/contactsCardConstants';
import { CLEAR_COMPANY_CARD, GET_COMPANY_CARD_SUCCESS_REQUEST } from 'crm-constants/salePage/companyCardConstant';
import { CLEAR_ACTIVITIES_HISTORY } from 'crm-constants/salePage/activitiesHistoryConstant';
import { getSaleById } from 'crm-api/saleService';

import type { Sale } from 'crm-types/sales';

export const clearSaleStore = () => (dispatch: Dispatch) => {
    dispatch({
        type: CLEAR_SALE_CARD,
    });

    dispatch({
        type: CLEAR_CONTACTS_CARD,
    });

    dispatch({
        type: CLEAR_COMPANY_CARD,
    });

    dispatch({
        type: CLEAR_ACTIVITIES_HISTORY,
    });
};

export const fetchSale = (id: number) => (dispatch: Dispatch) => {
    dispatch({
        type: GET_SALE_CARD_REQUEST,
    });

    return getSaleById(id)
        .then((response: Sale) => {
            dispatch({
                type: GET_SALE_CARD_SUCCESS_REQUEST,
                payload: response,
            });

            if (pathOr(null, ['company', 'id'], response)) {
                dispatch({
                    type: GET_COMPANY_CARD_SUCCESS_REQUEST,
                    payload: response.company,
                });
            }

            return response;
        })
        .catch((error: Error) => {
            dispatch({
                type: GET_SALE_CARD_ERROR,
                payload: error,
            });

            throw new Error(error);
        });
};
